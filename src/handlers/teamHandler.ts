import {Request, Response} from 'express';
import {Team} from '../models/team';
import {pool} from '../db/pool';
import crypto from 'crypto'

export let teams: Team[] = [];

export const listTeams = async (_req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM teams ORDER BY created_at DESC`);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error listing teams: ', error);
        res.status(500).json({message: 'Error getting teams'})
    }
};

/*export const createTeam = (req: Request, res: Response) => {
    const {
        name,
        short_name,
        logo_url,
        primary_color,
        secondary_color,
    } = req.body;

    if (!name || name.trim().length < 2) {
        return res.status(400).json({ message: 'name is required and must have at least 2 characters' });
    }

    if (!short_name || short_name.trim().length < 2) {
        return res.status(400).json({ message: 'short_name is required and must have at least 2 characters' });
    }

    const now = new Date().toISOString();

    const team: Team = {
        id: Date.now().toString(),
        name,
        short_name,
        logo_url: logo_url || '',
        primary_color: primary_color || '',
        secondary_color: secondary_color || '',
        created_at: now,
        updated_at: now,
    };

    teams.push(team);

    return res.status(201).json(team);
};*/

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

export const updateTeam = (req: Request, res: Response) => {
    const { id } = req.params;

    const team = teams.find((team) => team.id === id);

    if (!team) {
        return res.status(404).json({ message: 'team not found' });
    }

    const {
        name,
        short_name,
        logo_url,
        primary_color,
        secondary_color,
    } = req.body;

    if (!name || name.trim().length < 2) {
        return res.status(400).json({
            message: 'name is required and must have at least 2 characters',
        });
    }

    if (!short_name || short_name.trim().length < 2) {
        return res.status(400).json({
            message: 'short_name is required and must have at least 2 characters',
        });
    }

    team.name = name;
    team.short_name = short_name;
    team.logo_url = logo_url || '';
    team.primary_color = primary_color || '';
    team.secondary_color = secondary_color || '';
    team.updated_at = new Date().toISOString();

    return res.status(200).json(team);
};

export const deleteTeam = (req: Request, res: Response) => {
    const { id } = req.params;

    const teamIndex = teams.findIndex((team) => team.id === id);

    if (teamIndex === -1) {
        return res.status(404).json({ message: 'team not found' });
    }

    teams.splice(teamIndex, 1);

    return res.status(204).send();
};