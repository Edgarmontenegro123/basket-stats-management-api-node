import { Request, Response } from 'express';
import { Game } from '../models/game';
import { teams } from './teamHandler';
import { seasons } from './seasonHandler';
import crypto from 'crypto';
import { pool } from '../db/pool';

let games: Game[] = [];

export const listGames = async (req: Request, res: Response) => {
    try {
        const query = `
      SELECT *
      FROM games
      ORDER BY created_at DESC
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
        is_friendly,
        home_score,
        away_score,
        status,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `

        const values = [
            crypto.randomUUID(),
            season_id,
            home_team_id,
            away_team_id,
            game_date,
            location,
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
      SELECT *
      FROM games
      WHERE id = $1
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

export const updateGame = (req: Request, res: Response) => {
    const { id } = req.params;

    const game = games.find((game) => game.id === id);

    if (!game) {
        return res.status(404).json({ message: 'game not found' });
    }

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
        return res.status(400).json({
            message: 'season_id is required',
        });
    }

    const seasonExists = seasons.some(
        (season) => season.id === season_id,
    );

    if (!seasonExists) {
        return res.status(404).json({
            message: 'season not found',
        });
    }

    const homeTeamExists = teams.some(
        (team) => team.id === home_team_id,
    );

    const awayTeamExists = teams.some(
        (team) => team.id === away_team_id,
    );

    if (!homeTeamExists) {
        return res.status(404).json({
            message: 'home team not found',
        });
    }

    if (!awayTeamExists) {
        return res.status(404).json({
            message: 'away team not found',
        });
    }

    if (home_team_id === away_team_id) {
        return res.status(400).json({
            message:
                'home_team_id and away_team_id must be different',
        });
    }

    game.season_id = season_id;
    game.home_team_id = home_team_id;
    game.away_team_id = away_team_id;
    game.game_date = game_date || game.game_date;
    game.location = location || '';
    game.is_friendly = Boolean(is_friendly);
    game.home_score = Number(home_score) || 0;
    game.away_score = Number(away_score) || 0;
    game.status = status || 'scheduled';
    game.updated_at = new Date().toISOString();

    return res.status(200).json(game);
};

export const deleteGame = (req: Request, res: Response) => {
    const { id } = req.params;

    const gameIndex = games.findIndex((game) => game.id === id);

    if (gameIndex === -1) {
        return res.status(404).json({ message: 'game not found' });
    }

    games.splice(gameIndex, 1);

    return res.status(204).send();
};