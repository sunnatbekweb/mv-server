import { ObjectId } from 'mongodb'
import { getDatabase } from '../config/database.js'

export async function getAllMovies({
	page = 1,
	limit = 20,
	filters = {}
} = {}) {
	const db = getDatabase()
	const skip = (page - 1) * limit

	const [movies, total] = await Promise.all([
		db.collection('movies').find(filters).skip(skip).limit(limit).toArray(),
		db.collection('movies').countDocuments(filters)
	])
	return {
		movies,
		pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
	}
}

export async function getGenreStats() {
	const db = getDatabase()

	const pipeline = [
		// 1. Разворачиваем массив genres: один фильм с 2 жанрами -> 2 отдельных документа
		{ $unwind: '$genres' },

		// 2. Группируем по значению жанра, считаем количество в каждой группе
		{ $group: { _id: '$genres', count: { $sum: 1 } } },

		// 3. Сортируем по убыванию количества
		{ $sort: { count: -1 } },

		// 4. Переименовываем _id в genre для более понятного ответа клиенту
		{ $project: { _id: 0, genre: '$_id', count: 1 } }
	]

	return db.collection('movies').aggregate(pipeline).toArray()
}

export async function getMovieById(id) {
	const db = getDatabase()
	return db.collection('movies').findOne({ _id: new ObjectId(id) })
}

export async function createMovie(movieData) {
	const db = getDatabase()
	const result = await db.collection('movies').insertOne(movieData)
	return { _id: result.insertedId, ...movieData }
}

export async function updateMovie(id, updates) {
	const db = getDatabase()
	return db
		.collection('movies')
		.updateOne({ _id: new ObjectId(id) }, { $set: updates })
}

export async function deleteMovie(id) {
	const db = getDatabase()
	return db.collection('movies').deleteOne({ _id: new ObjectId(id) })
}
