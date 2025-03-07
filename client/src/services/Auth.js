import Token from "./Token";
import $api from "../http";

class AuthService {
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

  static async refresh() {
    const response = await Token.update()
    return response.data
  }

  static async logout(signal) {
    const response = await $api.get(
      "http://localhost:8000/auth/logout/",
      {
        signal,
        withCredentials: true,
      }
    )
    return response.data
  }
}

export default AuthService