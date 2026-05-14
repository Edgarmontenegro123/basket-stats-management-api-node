import { Request, Response } from 'express';
import { Game } from '../models/game';
import { teams } from './teamHandler';
import { seasons } from './seasonHandler';

let games: Game[] = [];

export const listGames = (_req: Request, res: Response) => {
    return res.status(200).json(games);
};

export const createGame = (req: Request, res: Response) => {
    const {
        season_id,
        home_team_id,
        away_team_id,
        game_date,
        location,
        is_friendly,
        home_score,
        away_score,
        status,
    } = req.body;

    if (!season_id) {
        return res.status(400).json({ message: 'season_id is required' });
    }

    const seasonExists = seasons.some((season) => season.id === season_id);

    if (!seasonExists) {
        return res.status(404).json({ message: 'season not found' });
    }

    const homeTeamExists = teams.some((team) => team.id === home_team_id);
    const awayTeamExists = teams.some((team) => team.id === away_team_id);

    if (!homeTeamExists) {
        return res.status(404).json({ message: 'home team not found' });
    }

    if (!awayTeamExists) {
        return res.status(404).json({ message: 'away team not found' });
    }

    if (home_team_id === away_team_id) {
        return res.status(400).json({
            message: 'home_team_id and away_team_id must be different',
        });
    }

    const now = new Date().toISOString();

    const game: Game = {
        id: Date.now().toString(),
        season_id,
        home_team_id,
        away_team_id,
        game_date: game_date || now,
        location: location || '',
        is_friendly: Boolean(is_friendly),
        home_score: Number(home_score) || 0,
        away_score: Number(away_score) || 0,
        status: status || 'scheduled',
        created_at: now,
        updated_at: now,
    };

    games.push(game);

    return res.status(201).json(game);
};

export const getGameById = (req: Request, res: Response) => {
    const { id } = req.params;

    const game = games.find((game) => game.id === id);

    if (!game) {
        return res.status(404).json({ message: 'game not found' });
    }

    return res.status(200).json(game);
};