export function validate(schema, source = 'body') {
	return (req, res, next) => {
		const result = schema.safeParse(req[source])

		if (!result.success) {
			const message = result.error.errors.map(e => e.message).join('; ')
			return res.status(400).json({ error: message })
		}

		if (source === 'query') {
			// req.query в Express 5 — getter-only, поэтому мутируем объект, а не переприсваиваем
			Object.keys(req.query).forEach(key => delete req.query[key])
			Object.assign(req.query, result.data)
		} else {
			req[source] = result.data
		}

		next()
	}
}
