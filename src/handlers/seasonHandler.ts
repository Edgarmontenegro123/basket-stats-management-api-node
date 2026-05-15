import { Request, Response } from 'express';
import crypto from 'crypto'
import { Season } from '../models/season';
import { teams } from './teamHandler';
import { pool } from '../db/pool'

export let seasons: Season[] = [];

export const listSeasons = async (req: Request, res: Response) => {
    try {
        const query = `
      SELECT *
      FROM seasons
      ORDER BY created_at DESC
    `

        const result = await pool.query(query)

        res.status(200).json(result.rows)
    } catch (error) {
        console.error('Error getting seasons:', error)

        res.status(500).json({
            message: 'Error getting seasons',
        })
    }
}

export const createSeason = async (req: Request, res: Response) => {
    try {
        const { team_id, name, year, is_active } = req.body

        const query = `
      INSERT INTO seasons (
        id,
        team_id,
        name,
        year,
        is_active,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `

        const values = [
            crypto.randomUUID(),
            team_id,
            name,
            year,
            is_active,
            new Date(),
            new Date(),
        ]

        const result = await pool.query(query, values)

        res.status(201).json(result.rows[0])
    } catch (error) {
        console.error('Error creating season:', error)

        res.status(500).json({
            message: 'Error creating season',
        })
    }
}

export const getSeasonById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const query = `
      SELECT *
      FROM seasons
      WHERE id = $1
    `

        const result = await pool.query(query, [id])

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Season not found',
            })
        }

        res.status(200).json(result.rows[0])
    } catch (error) {
        console.error('Error getting season:', error)

        res.status(500).json({
            message: 'Error getting season',
        })
    }
}

export const updateSeason = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { team_id, name, year, is_active } = req.body

        const query = `
      UPDATE seasons
      SET
        team_id = $1,
        name = $2,
        year = $3,
        is_active = $4,
        updated_at = $5
      WHERE id = $6
      RETURNING *
    `

        const values = [
            team_id,
            name,
            year,
            is_active,
            new Date(),
            id,
        ]

        const result = await pool.query(query, values)

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Season not found',
            })
        }

        res.status(200).json(result.rows[0])
    } catch (error) {
        console.error('Error updating season:', error)

        res.status(500).json({
            message: 'Error updating season',
        })
    }
}

export const deleteSeason = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const query = `
      DELETE FROM seasons
      WHERE id = $1
      RETURNING *
    `

        const result = await pool.query(query, [id])

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Season not found',
            })
        }

        res.status(200).json({
            message: 'Season deleted successfully',
        })
    } catch (error) {
        console.error('Error deleting season:', error)

        res.status(500).json({
            message: 'Error deleting season',
        })
    }
}