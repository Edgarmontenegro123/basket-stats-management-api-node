import { Router } from 'express';
import {
    createGame,
    listGames,
    getGameById,
    updateGame,
    updateGameResult,
    deleteGame,
} from '../handlers/gameHandler';

const router = Router();

router.get('/games', listGames);
router.get('/games/:id', getGameById);
router.post('/games', createGame);
router.put('/games/:id', updateGame);
router.patch('/games/:id/result', updateGameResult);
router.delete('/games/:id', deleteGame);


export default router;