import { AppError } from '../errors/AppError.js'
import * as moviesService from '../services/movies.service.js'

export async function getMovies(req, res) {
	const { page = 1, limit = 20, genre, year, title } = req.query

	const filters = {}
	if (genre) filters.genres = genre
	if (year) filters.year = year
	if (title) filters.title = { $regex: title, $options: 'i' }

	const result = await moviesService.getAllMovies({ page, limit, filters })
	res.status(200).json(result)
}

export async function getGenreStats(req, res) {
	const stats = await moviesService.getGenreStats()
	res.status(200).json(stats)
}

export async function getMovieById(req, res) {
	const movie = await moviesService.getMovieById(req.params.id)

	if (!movie) {
		throw new AppError('Фильм не найден', 404)
	}

	res.status(200).json(movie)
}

export async function createMovie(req, res) {
	const newMovie = await moviesService.createMovie(req.body)
	res.status(201).json(newMovie)
}

export async function updateMovie(req, res) {
	const result = await moviesService.updateMovie(req.params.id, req.body)

	if (result.matchedCount === 0) {
		throw new AppError('Фильм не найден', 404)
	}

	res.status(200).json({ message: 'Фильм обновлён' })
}

export async function deleteMovie(req, res) {
	const result = await moviesService.deleteMovie(req.params.id)

	if (result.deletedCount === 0) {
		throw new AppError('Фильм не найден', 404)
	}

	res.status(200).json({ message: 'Фильм удалён' })
}
