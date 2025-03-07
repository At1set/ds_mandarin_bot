export default class ApiError extends Error {
  status
  errors

  constructor(status, message, errors = []) {
    super(message)
    this.status = status
    this.errors = errors
  }

  static UnauthorizedError() {
    return new ApiError(401, "User isn't authorized!")
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors)
  }

  static NoBotConnection() {
    return new ApiError(500, "Server isn't connected to a Bot!")
  }

  static TokenExchangeFailed(errors = []) {
    return new ApiError(500, "Error exchanging code for discord token", errors)
  }
}
