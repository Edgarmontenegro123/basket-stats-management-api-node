import { Router } from 'express';
import { createGame, listGames } from '../handlers/gameHandler';

const router = Router();

router.get('/games', listGames);
router.post('/games', createGame);

export default router;