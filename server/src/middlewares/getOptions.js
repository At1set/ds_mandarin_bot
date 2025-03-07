import ApiError from "../exceptions/ApiError.js";

export default function (req, res, next) {
  try {
    const guildID = req.params.guildID
    if (!guildID) return ApiError.BadRequest("The query param guildID wasn't specified!")
    return next()
  } catch (error) {
    throw new ApiError(500, "Oops... Something went wrong!", [error])
  }
}