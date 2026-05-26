import { Request, Response } from 'express'
import { randomUUID } from 'crypto'
import { pool } from '../db/pool'
import { CreatePlayerInput } from '../models/player'


const validatePlayerInput = (
    first_name: string,
    last_name: string,
    number: number
) => {
    if (!first_name || first_name.trim().length < 2) {
        return 'first_name must contain at least 2 characters'
    }

    if (!last_name || last_name.trim().length < 2) {
        return 'last_name must contain at least 2 characters'
    }

    if (number < 0 || number > 99) {
        return 'number must be between 0 and 99'
    }

    return null
}

export const getPlayers = async (_req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT *
            FROM players
            ORDER BY created_at DESC
        `)

        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to fetch players' })
    }
}

export const getPlayersByTeam = async (req: Request, res: Response) => {
    try {
        const { teamId } = req.params

        const result = await pool.query(
            `
                SELECT *
                FROM players
                WHERE team_id = $1
                ORDER BY number ASC
            `,
            [teamId]
        )

        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to fetch team players' })
    }
}

export const getPlayerById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const result = await pool.query(
            `
                SELECT *
                FROM players
                WHERE id = $1
            `,
            [id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Player not found',
            })
        }

        res.json(result.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to fetch player' })
    }
}

export const createPlayer = async (req: Request, res: Response) => {
    try {
        const {
            team_id,
            first_name,
            last_name,
            number,
            position,
            height_cm,
            weight_kg,
            birth_date,
            photo_url,
        }: CreatePlayerInput = req.body

        if (!team_id) {
            return res.status(400).json({
                error: 'team_id is required',
            })
        }

        const validationError = validatePlayerInput(
            first_name,
            last_name,
            number
        )

        if (validationError) {
            return res.status(400).json({
                error: validationError,
            })
        }

        const id = randomUUID()

        const result = await pool.query(
            `
                INSERT INTO players (
                    id,
                    team_id,
                    first_name,
                    last_name,
                    number,
                    position,
                    height_cm,
                    weight_kg,
                    birth_date,
                    photo_url
                )
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
                RETURNING *
            `,
            [
                id,
                team_id,
                first_name,
                last_name,
                number,
                position || null,
                height_cm || null,
                weight_kg || null,
                birth_date || null,
                photo_url || null,
            ]
        )

        res.status(201).json(result.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to create player' })
    }
}

export const updatePlayer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const {
            team_id,
            first_name,
            last_name,
            number,
            position,
            height_cm,
            weight_kg,
            birth_date,
            photo_url,
        }: CreatePlayerInput = req.body

        if (!team_id) {
            return res.status(400).json({ error: 'team_id is required' })
        }

        const validationError = validatePlayerInput(
            first_name,
            last_name,
            number
        )

        if (validationError) {
            return res.status(400).json({
                error: validationError,
            })
        }

        const result = await pool.query(
            `
                UPDATE players
                SET
                    team_id = $1,
                    first_name = $2,
                    last_name = $3,
                    number = $4,
                    position = $5,
                    height_cm = $6,
                    weight_kg = $7,
                    birth_date = $8,
                    photo_url = $9,
                    updated_at = NOW()
                WHERE id = $10
                RETURNING *
            `,
            [
                team_id,
                first_name,
                last_name,
                number,
                position || null,
                height_cm || null,
                weight_kg || null,
                birth_date || null,
                photo_url || null,
                id,
            ]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Player not found' })
        }

        res.json(result.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to update player' })
    }
}

export const deletePlayer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const result = await pool.query(
            `
                DELETE FROM players
                WHERE id = $1
                RETURNING *
            `,
            [id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Player not found' })
        }

        res.json({
            message: 'Player deleted successfully',
            player: result.rows[0],
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to delete player' })
    }
}