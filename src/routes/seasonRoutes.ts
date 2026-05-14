import { Router } from 'express';
import {
    createSeason,
    getSeasonById,
    listSeasons } from '../handlers/seasonHandler';

const router = Router();

router.get('/seasons', listSeasons);
router.get("/seasons/:id", getSeasonById);
router.post('/seasons', createSeason);

export default router;