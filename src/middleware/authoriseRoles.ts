import { NextFunction, Request, Response } from 'express'

export const authoriseRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user?.role

        if (!userRole) {
            return res.status(403).json({
                message: 'User role is required',
            })
        }

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                message: 'You do not have permission to perform this action',
            })
        }

        next()
    }
}