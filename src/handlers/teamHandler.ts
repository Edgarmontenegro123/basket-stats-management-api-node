import {Request, Response} from 'express';
import {Team} from '../models/team';

let teams: Team[] = [];

export const listTeams = (_req: Request, res: Response) => {
    res.status(200).json(teams);
};

export const createTeam = (req: Request, res: Response) => {
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
};