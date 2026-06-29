import {Request, Response} from 'express';
import {pool} from '../db/pool';
import crypto from 'crypto'

export const listTeams = async (_req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM teams ORDER BY created_at DESC`);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error listing teams: ', error);
        res.status(500).json({message: 'Error getting teams'})
    }
};

export const createTeam = async (req: Request, res: Response) => {
    try {
        const {
            name,
            short_name,
            logo_url,
            primary_color,
            secondary_color,
        } = req.body

        const newTeam = {
            id: crypto.randomUUID(),
            name,
            short_name,
            logo_url,
            primary_color,
            secondary_color,
            created_at: new Date(),
            updated_at: new Date(),
        }

        const query = `
      INSERT INTO teams (
        id,
        name,
        short_name,
        logo_url,
        primary_color,
        secondary_color,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `

        const values = [
            newTeam.id,
            newTeam.name,
            newTeam.short_name,
            newTeam.logo_url,
            newTeam.primary_color,
            newTeam.secondary_color,
            newTeam.created_at,
            newTeam.updated_at,
        ]

        const result = await pool.query(query, values)

        res.status(201).json(result.rows[0])
    } catch (error) {
        console.error('Error creating team:', error)

        res.status(500).json({
            message: 'Error creating team',
        })
    }
}

export const getTeamById = async (req: Request, res: Response) => {
    try {
        const {id} = req.params

        const query = `
            SELECT *
            FROM teams 
            WHERE id = $1
        `
        const result = await pool.query(query, [id])

        if (result.rows.length === 0) {
            return res.status(404).json({message: 'Team not found'})
        }

        res.status(200).json(result.rows[0])
    } catch (error) {
        console.error('Error getting team:', error)

        res.status(500).json({message: 'Error getting team'})
    }
};

export const updateTeam = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const {
            name,
            short_name,
            logo_url,
            primary_color,
            secondary_color,
        } = req.body

        const query = `
      UPDATE teams
      SET
        name = $1,
        short_name = $2,
        logo_url = $3,
        primary_color = $4,
        secondary_color = $5,
        updated_at = $6
      WHERE id = $7
      RETURNING *
    `

        const values = [
            name,
            short_name,
            logo_url,
            primary_color,
            secondary_color,
            new Date(),
            id,
        ]

        const result = await pool.query(query, values)

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Team not found',
            })
        }

        res.status(200).json(result.rows[0])
    } catch (error) {
        console.error('Error updating team:', error)

        res.status(500).json({
            message: 'Error updating team',
        })
    }
}

export const deleteTeam = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const linkedPlayers = await pool.query(
            'SELECT id FROM players WHERE team_id = $1 LIMIT 1',
            [id],
        )

        if (linkedPlayers.rows.length > 0) {
            return res.status(409).json({
                message: 'Team cannot be deleted because it has linked players.',
            })
        }

        const linkedSeasons = await pool.query(
            'SELECT id FROM seasons WHERE team_id = $1 LIMIT 1',
            [id],
        )

        if (linkedSeasons.rows.length > 0) {
            return res.status(409).json({
                message: 'Team cannot be deleted because it has linked seasons.',
            })
        }

        const linkedGames = await pool.query(
            `
            SELECT id
            FROM games
            WHERE home_team_id = $1 OR away_team_id = $1
            LIMIT 1
            `,
            [id],
        )

        if (linkedGames.rows.length > 0) {
            return res.status(409).json({
                message: 'Team cannot be deleted because it has linked games.',
            })
        }

        const query = `
            DELETE FROM teams
            WHERE id = $1
            RETURNING *
        `

        const result = await pool.query(query, [id])

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Team not found',
            })
        }

        res.status(200).json({
            message: 'Team deleted successfully',
        })
    } catch (error) {
        console.error('Error deleting team:', error)

        res.status(500).json({
            message: 'Error deleting team',
        })
    }
}