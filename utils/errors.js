/**
 * 自定义404错误
 */
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
    }
}

/**
 * 自定义400错误
 */
class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = "BadRequestError";
    }
}

/**
 * 自定义401错误
 */
class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = "UnauthorizedError";
    }
}
module.exports = {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
}