import express from 'express'
import cors from 'cors'
import router from './routes';

const app = express()
const PORT = process.env.PORT || 3001
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
    origin: allowedOrigin,
}))

app.use(express.json())

app.use(router)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})