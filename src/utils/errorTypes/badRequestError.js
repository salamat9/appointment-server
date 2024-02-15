class BadRequestError extends Error {
	name;
	status;

	constructor(message, status = 400) {
		super(message);
		this.name = 'BadRequestError';
		this.status = status;
	}
}

module.exports = BadRequestError;
