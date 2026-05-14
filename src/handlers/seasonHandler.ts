import { Request, Response } from 'express';
import { Season } from '../models/season';
import { teams } from './teamHandler';

export let seasons: Season[] = [];

export const listSeasons = (_req: Request, res: Response) => {
    return res.status(200).json(seasons);
};

export const createSeason = (req: Request, res: Response) => {
    const { team_id, name, year, is_active } = req.body;

    if (!team_id) {
        return res.status(400).json({ message: 'team_id is required' });
    }

    const teamExists = teams.some((team) => team.id === team_id);

    if (!teamExists) {
        return res.status(404).json({ message: 'team not found' });
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

    const now = new Date().toISOString();

    const season: Season = {
        id: Date.now().toString(),
        team_id,
        name,
        year: Number(year),
        is_active: Boolean(is_active),
        created_at: now,
        updated_at: now,
    };

    seasons.push(season);

    return res.status(201).json(season);
};

export const getSeasonById = (req: Request, res: Response) => {
    const { id } = req.params;

    const season = seasons.find((season) => season.id === id);

    if (!season) {
        return res.status(404).json({ message: 'season not found' });
    }

    return res.status(200).json(season);
};

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