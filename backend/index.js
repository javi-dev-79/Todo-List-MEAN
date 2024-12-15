import express from 'express'
import connectDB from './config/db.js'
import taskRoutes from './routes/taskRoutes.js'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/tasks', taskRoutes)

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
})

app.get('/', (req, res) => {
    res.send('La uri es: ' + process.env.MONGO_URI)
})
