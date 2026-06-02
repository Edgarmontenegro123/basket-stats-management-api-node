import { Router } from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import {
    createGame,
    listGames,
    getGameById,
    updateGame,
    updateGameResult,
    deleteGame,
} from '../handlers/gameHandler'

const router = Router()

router.get('/games', listGames)
router.get('/games/:id', getGameById)

router.post('/games', authMiddleware, createGame)
router.put('/games/:id', authMiddleware, updateGame)
router.patch('/games/:id/result', authMiddleware, updateGameResult)
router.delete('/games/:id', authMiddleware, deleteGame)


export default router;