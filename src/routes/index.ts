import {Router} from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import authRoutes from './authRoutes'
import playerRoutes from './playerRoutes'
import teamRoutes from './teamRoutes'
import seasonRoutes from './seasonRoutes'
import gameRoutes from './gameRoutes';

const router = Router()

router.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Basket Stats Management API running',
    })
})

router.get('/auth-check', authMiddleware, (_req, res) => {
    res.status(200).json({
        message: 'Authenticated request',
    })
})

router.use(authRoutes)
router.use(playerRoutes)
router.use(teamRoutes)
router.use(seasonRoutes)
router.use(gameRoutes)

export default router