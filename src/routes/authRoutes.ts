import { Router } from 'express'
import { loginUser, registerUser } from '../handlers/authHandler'

const router = Router()

router.post('/auth/register', registerUser)
router.post('/auth/login', loginUser)

export default router