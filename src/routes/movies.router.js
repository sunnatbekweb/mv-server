import { Router } from 'express'
import * as moviesController from '../controllers/movies.controller.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import {
	createMovieSchema,
	movieIdSchema,
	movieQuerySchema,
	updateMovieSchema
} from '../schemas/movie.schema.js'

const router = Router()

router.get(
	'/',
	validate(movieQuerySchema, 'query'),
	asyncHandler(moviesController.getMovies)
)

router.get('/stats/genres', asyncHandler(moviesController.getGenreStats))

router.get(
	'/:id',
	validate(movieIdSchema, 'params'),
	asyncHandler(moviesController.getMovieById)
)

router.post(
	'/',
	validate(createMovieSchema, 'body'),
	asyncHandler(moviesController.createMovie)
)

router.put(
	'/:id',
	validate(movieIdSchema, 'params'),
	validate(updateMovieSchema, 'body'),
	asyncHandler(moviesController.updateMovie)
)

router.delete(
	'/:id',
	validate(movieIdSchema, 'params'),
	asyncHandler(moviesController.deleteMovie)
)

export default router
