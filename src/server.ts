import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Basket Stats Management API running',
    })
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})