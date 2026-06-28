import { Router } from 'express'
import {authMiddleware} from '../middleware/authMiddleware'
import { authoriseRoles } from '../middleware/authoriseRoles'
import {
    createSeason,
    getSeasonById,
    listSeasons,
    updateSeason,
    deleteSeason,
} from '../handlers/seasonHandler'

const router = Router()

router.get('/seasons', listSeasons)
router.get("/seasons/:id", getSeasonById)

router.post('/seasons', authMiddleware, authoriseRoles('admin'), createSeason)
router.put('/seasons/:id', authMiddleware, authoriseRoles('admin'), updateSeason)
router.delete('/seasons/:id', authMiddleware, authoriseRoles('admin'), deleteSeason)

export default router;