import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt, { Secret, SignOptions } from 'jsonwebtoken'
import { pool } from '../db/pool'

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'basket_stats_dev_secret'

const jwtOptions: SignOptions = {
    expiresIn: '1d',
}

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email and password are required',
            })
        }

        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        )

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: 'Email already registered',
            })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash, role)
             VALUES ($1, $2, $3, $4)
             RETURNING id, name, email, role, created_at`,
            [name, email, passwordHash, 'player']
        )

        res.status(201).json(result.rows[0])
    } catch (error) {
        res.status(500).json({
            message: 'Error registering user',
        })
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required',
            })
        }

        const result = await pool.query(
            'SELECT id, name, email, role, password_hash FROM users WHERE email = $1',
            [email]
        )

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: 'Invalid credentials',
            })
        }

        const user = result.rows[0]

        const isPasswordValid = await bcrypt.compare(password, user.password_hash)

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid credentials',
            })
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            JWT_SECRET,
            jwtOptions
        )

        res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error logging in',
        })
    }
}