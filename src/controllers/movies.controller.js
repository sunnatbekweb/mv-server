import { ObjectId } from 'mongodb'
import * as moviesService from '../services/movies.service.js'

export async function getMovies(req, res) {
	try {
		const page = parseInt(req.query.page) || 1
		const limit = parseInt(req.query.limit) || 20

		const filters = {}

		if (req.query.genre) {
			filters.genres = req.query.genre
		}

		if (req.query.year) {
			filters.year = parseInt(req.query.year)
		}

		if (req.query.title) {
			filters.title = { $regex: req.query.title, $options: 'i' }
		}

		const result = await moviesService.getAllMovies({ page, limit, filters })
		res.status(200).json(result)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Не удалось получить список фильмов' })
	}
}

export async function getGenreStats(req, res) {
	try {
		const stats = await moviesService.getGenreStats()
		res.status(200).json(stats)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Не удалось получить статистику по жанрам' })
	}
}

export async function getMovieById(req, res) {
	try {
		const { id } = req.params

		if (!ObjectId.isValid(id)) {
			return res.status(400).json({ error: 'Некорректный id' })
		}

		const movie = await moviesService.getMovieById(id)

		if (!movie) {
			return res.status(404).json({ error: 'Фильм не найден' })
		}

		res.status(200).json(movie)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Не удалось получить фильм' })
	}
}

export async function createMovie(req, res) {
	try {
		const { title, year, genres } = req.body

		if (!title) {
			return res.status(400).json({ error: 'Поле title обязательно' })
		}

		const newMovie = await moviesService.createMovie({
			title,
			year,
			genres: genres || []
		})
		res.status(201).json(newMovie)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Не удалось создать фильм' })
	}
}

export async function updateMovie(req, res) {
	try {
		const { id } = req.params

		if (!ObjectId.isValid(id)) {
			return res.status(400).json({ error: 'Некорректный id' })
		}

		const result = await moviesService.updateMovie(id, req.body)

		if (result.matchedCount === 0) {
			return res.status(404).json({ error: 'Фильм не найден' })
		}

		res.status(200).json({ message: 'Фильм обновлён' })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Не удалось обновить фильм' })
	}
}

export async function deleteMovie(req, res) {
	try {
		const { id } = req.params

		if (!ObjectId.isValid(id)) {
			return res.status(400).json({ error: 'Некорректный id' })
		}

		const result = await moviesService.deleteMovie(id)

		if (result.deletedCount === 0) {
			return res.status(404).json({ error: 'Фильм не найден' })
		}

		res.status(200).json({ message: 'Фильм удалён' })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Не удалось удалить фильм' })
	}
}
