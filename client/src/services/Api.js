import $api from "../http"

class ApiService {
  static async getToken({ code, state, ...data }, signal) {
    const response = await $api.post(
      "http://localhost:8000/auth/token/",
      {
        code,
        state,
        ...data,
      },
      {
        signal,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    return response.data
  }
}

export default ApiService