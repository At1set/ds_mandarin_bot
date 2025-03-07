import ApiError from "../exceptions/ApiError.js"
import tokenService from "../services/Token.js"

export default function (req, res, next) {
  try {
    const { code, state } = req.body
    const reqState = req.cookies?.state
    
    console.log(reqState, state, req.cookies);

    if (!code) throw ApiError.BadRequest("Code not provided")
    if (!state) throw ApiError.BadRequest("The param state was not found")
    if (!state || state !== reqState)
      throw ApiError.BadRequest(
        "The param state doesn't match with your cookie state!"
      )
    
    req.data = {code, state, reqState}
    
    next()
  } catch (e) {
    return next(e)
  }
}
