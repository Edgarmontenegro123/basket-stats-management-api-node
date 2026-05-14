import {Router} from 'express'
import teamRoutes from './teamRoutes'

const router = Router()

router.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Basket Stats Management API running',
    })
})

router.use(teamRoutes)

export default router