import { ObjectId } from 'mongodb'
import z from 'zod'

export const createMovieSchema = z.object({
	title: z.string().min(1, 'title обязателен'),
	year: z.number().int().optional(),
	genres: z.array(z.string()).optional()
})

export const updateMovieSchema = createMovieSchema.partial()

export const movieIdSchema = z.object({
	id: z.string().refine(val => ObjectId.isValid(val), {
		message: 'Некорректный id'
	})
})

export const movieQuerySchema = z.object({
	page: z.coerce.number().int().positive().optional(),
	limit: z.coerce.number().int().positive().max(100).optional(),
	genre: z.string().optional(),
	year: z.coerce.number().int().optional(),
	title: z.string().optional()
})
