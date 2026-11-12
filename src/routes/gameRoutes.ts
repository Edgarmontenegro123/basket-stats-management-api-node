import { Router } from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import { authoriseRoles } from '../middleware/authoriseRoles'
import {
    createGame,
    listGames,
    getGameById,
    updateGame,
    updateGameResult,
    deleteGame,
    updateGameDate,
} from '../handlers/gameHandler'

const router = Router()

router.get('/games', listGames)
router.get('/games/:id', getGameById)

router.post('/games', authMiddleware, authoriseRoles('admin'), createGame)
router.patch('/games/:id', authMiddleware, authoriseRoles('admin', 'service'), updateGame)
router.patch('/games/:id/date', authMiddleware, authoriseRoles('admin', 'service'), updateGameDate)
router.patch('/games/:id/result', authMiddleware, authoriseRoles('admin', 'coach', 'dt', 'service'), updateGameResult)
router.delete('/games/:id', authMiddleware, authoriseRoles('admin'), deleteGame)


export default router;