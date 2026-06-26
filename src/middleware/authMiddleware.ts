import { NextFunction, Request, Response } from 'express'
import jwt, { Secret } from 'jsonwebtoken'

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'basket_stats_dev_secret'

type JwtPayload = {
    id: string
    email: string
    role: string
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
        }
    }
}

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({
            message: 'Authorization token is required',
        })
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({
            message: 'Invalid authorization format',
        })
    }

    try {
        req.user = jwt.verify(token, JWT_SECRET) as JwtPayload

        next()
    } catch (error) {
        res.status(401).json({
            message: 'Invalid or expired token',
        })
    }
}