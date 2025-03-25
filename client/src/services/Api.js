import $api from "../http"
import { TokenError } from "./Token"

async function handleRequest(request, setAuth) {
  try {
    return await request()
  } catch (error) {
    // Ошибка isTokenError означает, что мы не смогли обновить токен / он отсуствует вовсе.
    const isTokenError = error instanceof TokenError
    if (isTokenError) {
      return setAuth(false)
    }
    throw error
  }
}

class ApiService {
  static async getUserGuilds(  setAuth, signal ) {
    const request = async () => {
      const response = await $api.get(
        "http://localhost:8000/api/getUserGuilds",
        {
          signal: signal
        }
      )
      return response.data
    }

    return await handleRequest(request, setAuth)
  }
}

export default ApiService