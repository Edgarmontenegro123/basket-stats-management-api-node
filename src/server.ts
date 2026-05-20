import express from 'express'
import cors from 'cors'
import router from './routes';

const app = express()
const PORT = process.env.PORT || 3001
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error('Not allowed by CORS'));
    },
    methods: [ 'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}))

app.use(express.json())

app.use(router)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})