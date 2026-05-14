import { Router } from 'express';
import {
    createSeason,
    getSeasonById,
    listSeasons,
    updateSeason,
    deleteSeason,
} from '../handlers/seasonHandler';

const router = Router();

router.get('/seasons', listSeasons);
router.get("/seasons/:id", getSeasonById);
router.post('/seasons', createSeason);
router.put("/seasons/:id", updateSeason);
router.delete("/seasons/:id", deleteSeason);

export default router;