import { Router } from 'express'
import {authMiddleware} from '../middleware/authMiddleware'
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

router.post('/seasons', authMiddleware, createSeason)
router.put("/seasons/:id", authMiddleware, updateSeason)
router.delete("/seasons/:id", authMiddleware, deleteSeason)

export default router;