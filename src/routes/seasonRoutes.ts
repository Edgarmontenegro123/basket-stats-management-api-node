import { Router } from 'express';
import { createSeason, listSeasons } from '../handlers/seasonHandler';

const router = Router();

router.get('/seasons', listSeasons);
router.post('/seasons', createSeason);

export default router;