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

export const deleteSeason = (req: Request, res: Response) => {
    const { id } = req.params;

    const seasonIndex = seasons.findIndex((season) => season.id === id);

    if (seasonIndex === -1) {
        return res.status(404).json({ message: 'season not found' });
    }

    seasons.splice(seasonIndex, 1);

    return res.status(204).send();
};

export const updateSeason = (req: Request, res: Response) => {
    const { id } = req.params;

    const season = seasons.find((season) => season.id === id);

    if (!season) {
        return res.status(404).json({ message: 'season not found' });
    }

    const { team_id, name, year, is_active } = req.body;

    if (!team_id) {
        return res.status(400).json({
            message: 'team_id is required',
        });
    }

    const teamExists = teams.some((team) => team.id === team_id);

    if (!teamExists) {
        return res.status(404).json({
            message: 'team not found',
        });
    }

    if (!name || name.trim().length < 2) {
        return res.status(400).json({
            message: 'name is required and must have at least 2 characters',
        });
    }

    if (!year || Number(year) < 2000) {
        return res.status(400).json({
            message: 'year is required and must be greater than or equal to 2000',
        });
    }

    season.team_id = team_id;
    season.name = name;
    season.year = Number(year);
    season.is_active = Boolean(is_active);
    season.updated_at = new Date().toISOString();

    return res.status(200).json(season);
};