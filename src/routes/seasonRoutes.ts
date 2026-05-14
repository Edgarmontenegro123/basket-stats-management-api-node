import { Router } from 'express';
import {
    createSeason,
    getSeasonById,
    listSeasons,
    deleteSeason,
} from '../handlers/seasonHandler';

const router = Router();

router.get('/seasons', listSeasons);
router.get("/seasons/:id", getSeasonById);
router.post('/seasons', createSeason);
router.delete("/seasons/:id", deleteSeason);

export default router;