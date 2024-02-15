class DataNotFoundError extends Error {
	name;
	status;

	constructor(message, status = 404) {
		super(message);
		this.name = 'DataNotFoundError';
		this.status = status;
	}
}

module.exports = DataNotFoundError;
