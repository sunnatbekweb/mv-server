import express from 'express'
import { connectToDatabase } from './config/database.js'
import { errorHandler } from './middleware/errorHandler.js'
import moviesRouter from './routes/movies.router.js'

const app = express()
app.use(express.json())

app.use('/movies', moviesRouter)

app.use(errorHandler)

const PORT = process.env.PORT || 5500

connectToDatabase().then(() => {
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`)
	})
})
