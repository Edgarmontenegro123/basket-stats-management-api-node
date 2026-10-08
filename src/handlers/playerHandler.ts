import {Request, Response} from 'express'
import {randomUUID} from 'crypto'
import {pool} from '../db/pool'
import {CreatePlayerInput, SyncPlayerInput} from '../models/player'


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

const deleteAnalyticsStatsByPlayerId = async (playerId: string | string[]) => {
    const idParam = Array.isArray(playerId) ? playerId[0] : playerId
    const analyticsUrl = process.env.ANALYTICS_API_URL
    if (!analyticsUrl) {
        console.error('ANALYTICS_API_URL is not configured')
        return
    }

    try {
        await fetch(`${analyticsUrl}/analytics/players/${idParam}`, {
            method: 'DELETE',
        })
    } catch (error) {
        console.error('Error deleting analytics for player:', error)
    }
}

export const deletePlayer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        await deleteAnalyticsStatsByPlayerId(id)

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

export const syncPlayersBatch = async (req: Request, res: Response) => {
    try {
        const players: SyncPlayerInput[] = req.body.players

        if (!Array.isArray(players) || players.length === 0) {
            return res.status(400).json({ error: 'players array is required' })
        }

        const syncedPlayers = []

        for (const player of players) {
            const { team_id, number, full_name } = player

            if (!team_id || !full_name) {
                continue
            }

            // Separar nombre y apellido básica (primer palabra = nombre, el resto = apellido)
            const nameParts = full_name.trim().split(' ')
            const firstName = nameParts[0] || 'Jugador'
            const lastName = nameParts.slice(1).join(' ') || 'Sin Apellido'

            // 1. Buscar si existe por team_id y dorsal/número
            let existingPlayer = await pool.query(
                `
                    SELECT *
                    FROM players
                    WHERE team_id = $1 AND number = $2
                    LIMIT 1
                `,
                [team_id, number]
            )

            // 2. Si no existe por número, buscar por coincidencia de nombre y apellido
            if (existingPlayer.rows.length === 0) {
                existingPlayer = await pool.query(
                    `
                        SELECT *
                        FROM players
                        WHERE team_id = $1 
                          AND LOWER(first_name) = LOWER($2) 
                          AND LOWER(last_name) = LOWER($3)
                        LIMIT 1
                    `,
                    [team_id, firstName, lastName]
                )
            }

            if (existingPlayer.rows.length > 0) {
                // Si existe, devolver el jugador existente
                syncedPlayers.push(existingPlayer.rows[0])
            } else {
                // Si no existe, crearlo
                const id = randomUUID()
                const newPlayer = await pool.query(
                    `
                        INSERT INTO players (
                            id,
                            team_id,
                            first_name,
                            last_name,
                            number
                        )
                        VALUES ($1, $2, $3, $4, $5)
                        RETURNING *
                    `,
                    [id, team_id, firstName, lastName, number || 0]
                )
                syncedPlayers.push(newPlayer.rows[0])
            }
        }

        res.status(200).json(syncedPlayers)
    } catch (error) {
        console.error('Error syncing players batch:', error)
        res.status(500).json({ error: 'Failed to sync players' })
    }
}