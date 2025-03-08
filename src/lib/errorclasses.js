class NotFoundError extends Error {
	constructor(message) {
		super(message);
		this.name = 'NotFoundError';
	}
}

class ValidationError extends Error {
	constructor(message) {
		super(message);
		this.name = 'ValidationError';
	}
}

class UserAlreadyExistsError extends Error {
	constructor(message) {
		super(message);
		this.name = 'UserAlreadyExistsError';
	}
}

export { NotFoundError, ValidationError, UserAlreadyExistsError };
