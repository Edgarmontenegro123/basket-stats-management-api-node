import { Router } from 'express'
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
router.post('/players', createPlayer)
router.put('/players/:id', updatePlayer)
router.delete('/players/:id', deletePlayer)

export default router