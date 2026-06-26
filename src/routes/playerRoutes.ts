import { Router } from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import { authoriseRoles } from '../middleware/authoriseRoles'
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

router.post('/players', authMiddleware, authoriseRoles('admin', 'coach'), createPlayer)
router.put('/players/:id', authMiddleware, authoriseRoles('admin', 'coach'), updatePlayer)
router.delete('/players/:id', authMiddleware, authoriseRoles('admin', 'coach'), deletePlayer)

export default router