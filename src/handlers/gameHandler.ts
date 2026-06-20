import { Request, Response } from 'express';
import crypto from 'crypto';
import { pool } from '../db/pool';

export const listGames = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT
                games.*,
                home_team.name AS home_team_name,
                away_team.name AS away_team_name
            FROM games
                     JOIN teams AS home_team
                          ON games.home_team_id = home_team.id
                     JOIN teams AS away_team
                          ON games.away_team_id = away_team.id
            ORDER BY games.created_at DESC
    `

        const result = await pool.query(query)

        res.status(200).json(result.rows)
    } catch (error) {
        console.error('Error getting games:', error)

        res.status(500).json({
            message: 'Error getting games',
        })
    }
}

export const createGame = async (req: Request, res: Response) => {
    try {
        const {
            season_id,
            home_team_id,
            away_team_id,
            game_date,
            location,
            video_url,
            is_friendly,
            home_score,
            away_score,
            status,
        } = req.body

        const query = `
      INSERT INTO games (
        id,
        season_id,
        home_team_id,
        away_team_id,
        game_date,
        location,
        video_url,
        is_friendly,
        home_score,
        away_score,
        status,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `

        const values = [
            crypto.randomUUID(),
            season_id,
            home_team_id,
            away_team_id,
            game_date,
            location,
            video_url || null,
            is_friendly,
            home_score,
            away_score,
            status,
            new Date(),
            new Date(),
        ]

        const result = await pool.query(query, values)

        res.status(201).json(result.rows[0])
    } catch (error) {
        console.error('Error creating game:', error)

        res.status(500).json({
            message: 'Error creating game',
        })
    }
}

export const getGameById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const query = `
            SELECT
                games.*,
                home_team.name AS home_team_name,
                away_team.name AS away_team_name
            FROM games
                     JOIN teams AS home_team
                          ON games.home_team_id = home_team.id
                     JOIN teams AS away_team
                          ON games.away_team_id = away_team.id
            WHERE games.id = $1
    `

        const result = await pool.query(query, [id])

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Game not found',
            })
        }

        res.status(200).json(result.rows[0])
    } catch (error) {
        console.error('Error getting game:', error)

        res.status(500).json({
            message: 'Error getting game',
        })
    }
}

export const updateGame = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const {
            season_id,
            home_team_id,
            away_team_id,
            game_date,
            location,
            video_url,
            is_friendly,
            home_score,
            away_score,
            status,
        } = req.body

        const query = `
            UPDATE games
            SET
                season_id = $1,
                home_team_id = $2,
                away_team_id = $3,
                game_date = $4,
                location = $5,
                video_url = $6,
                is_friendly = $7,
                home_score = $8,
                away_score = $9,
                status = $10,
                updated_at = $11
            WHERE id = $12
                RETURNING *
    `

        const values = [
            season_id,
            home_team_id,
            away_team_id,
            game_date,
            location,
            video_url || null,
            is_friendly,
            home_score,
            away_score,
            status,
            new Date(),
            id,
        ]

        const result = await pool.query(query, values)

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Game not found' })
        }

        res.status(200).json(result.rows[0])
    } catch (error) {
        console.error('Error updating game:', error)
        res.status(500).json({ message: 'Error updating game' })
    }
}

export const updateGameResult = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const {
            home_score,
            away_score,
            status,
        } = req.body

        const query = `
            UPDATE games
            SET
                home_score = $1,
                away_score = $2,
                status = $3,
                updated_at = $4
            WHERE id = $5
            RETURNING *
        `

        const values = [
            home_score,
            away_score,
            status,
            new Date(),
            id,
        ]

        const result = await pool.query(query, values)

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Game not found',
            })
        }

        res.status(200).json(result.rows[0])
    } catch (error) {
        console.error('Error updating game result:', error)

        res.status(500).json({
            message: 'Error updating game result',
        })
    }
}

export const deleteGame = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const query = `
      DELETE FROM games
      WHERE id = $1
      RETURNING *
    `

        const result = await pool.query(query, [id])

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Game not found',
            })
        }

        res.status(200).json({
            message: 'Game deleted successfully',
        })
    } catch (error) {
        console.error('Error deleting game:', error)

        res.status(500).json({
            message: 'Error deleting game',
        })
    }
}