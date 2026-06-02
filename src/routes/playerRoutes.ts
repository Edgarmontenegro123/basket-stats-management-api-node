import { Router } from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import {
    createPlayer,
    deletePlayer,
    getPlayerById,
    getPlayers,
    getPlayersByTeam,
    updatePlayer,
} from '../handlers/playerHandler'

const router = Router()

router.get('/players', getPlayers)
router.get('/players/:id', getPlayerById)
router.get('/teams/:teamId/players', getPlayersByTeam)

router.post('/players', authMiddleware,  createPlayer)
router.put('/players/:id', authMiddleware,  updatePlayer)
router.delete('/players/:id', authMiddleware,  deletePlayer)

export default router