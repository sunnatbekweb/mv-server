export function errorHandler(err, req, res, next) {
	console.log(err)

	const statusCode = err.statusCode || 500

	const message = err.isOperational ? err.message : 'Внутренняя ошибка сервера'

	res.status(statusCode).json({ error: message })
}
