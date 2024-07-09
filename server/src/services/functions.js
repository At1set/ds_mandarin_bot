export function sendError(response, message, status) {
  response.status(status).send(message)
}