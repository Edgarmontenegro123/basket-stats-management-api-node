import { Router } from 'express';
import {
    createGame,
    listGames,
    getGameById,
    deleteGame,
} from '../handlers/gameHandler';

const router = Router();

router.get('/games', listGames);
router.get('/games/:id', getGameById);
router.post('/games', createGame);
router.delete('/games/:id', deleteGame);


export default router;