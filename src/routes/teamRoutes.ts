import { Router } from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import { authoriseRoles } from '../middleware/authoriseRoles'
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

router.post('/teams', authMiddleware, authoriseRoles('admin', 'coach'), createTeam)
router.put('/teams/:id', authMiddleware, authoriseRoles('admin', 'coach'), updateTeam)
router.delete('/teams/:id', authMiddleware, authoriseRoles('admin', 'coach'), deleteTeam)

export default router;