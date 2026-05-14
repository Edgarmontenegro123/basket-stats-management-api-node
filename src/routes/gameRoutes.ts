import { Router } from 'express';
import {
    createGame,
    listGames,
    getGameById,
} from '../handlers/gameHandler';

const router = Router();

router.get('/games', listGames);
router.get('/games/:id', getGameById);
router.post('/games', createGame);

export default router;