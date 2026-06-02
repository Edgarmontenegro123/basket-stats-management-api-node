import { Router } from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import {
    createTeam,
    getTeamById,
    listTeams,
    updateTeam,
    deleteTeam
} from '../handlers/teamHandler'


const router = Router()

router.get('/teams', listTeams)
router.get('/teams/:id', getTeamById)

router.post('/teams', authMiddleware, createTeam)
router.put('/teams/:id', authMiddleware, updateTeam)
router.delete('/teams/:id', authMiddleware, deleteTeam)

export default router;