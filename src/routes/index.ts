import {Router} from 'express'
import teamRoutes from './teamRoutes'
import seasonRoutes from './seasonRoutes'

const router = Router()

router.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Basket Stats Management API running',
    })
})

router.use(teamRoutes)
router.use(seasonRoutes)

export default router