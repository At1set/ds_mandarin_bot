import axios from "axios";

const useApi = () => {
  const guildID = window.location.pathname.split("/").pop()

  const subscribe = async ( signal ) => {
    const response = await axios.get(`http://192.168.0.191:8000/api/getNotification/${guildID}`,
    {
      signal,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  };

  const sendOptions = async ( data, signal ) => {
    const response = await axios.patch(`http://192.168.0.191:8000/api/updateConfig/${guildID}`, JSON.stringify(data),
    {
      signal,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  };

  const getOptions = async ({guildID, ...params}, signal) => {
    const response = await axios.get("http://localhost:8000/api/getOptions", {
      signal,
      params: {
        guildID,
        ...params,
      }
    });
    return response.data;
  }

  // Получение кода авторизации
  const getAuthCode = async ({ code_challenge, code_challenge_method="S256", ...params }, signal) => {
    const response = await axios.get("http://localhost:8000/auth/authorize/", {
      signal,
      withCredentials: true,
      params: {
        code_challenge: code_challenge,
        code_challenge_method: code_challenge_method,
        ...params,
      }
    })
    return response.data
  }

  // Получение токена доступа discord
  const getAccessTocken =  async ({ code, code_verifier, redirect_uri, ...data }, signal) => {
    const response = await axios.post("http://localhost:8000/auth/tocken/", JSON.stringify({
      code,
      code_verifier,
      redirect_uri,
      ...data,
    }), {
      signal,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.data
  }

  // Позволяет удалить сессию на стороне сервера
  const killAuthSession = async () => {
    const response = await axios.get("http://localhost:8000/auth/killSession", {
      withCredentials: true
    })
    return response.data
  }

  const getUserGuilds = async ( signal ) => {
    const tocken = localStorage.getItem("access_token")
    if (!tocken) throw new Error("Пользователь не авторизован!");
    
    const response = await axios.get("http://localhost:8000/api/getUserGuilds", {
      signal: signal,
      params: {
        tocken
      }
    })
    return response.data
  }

  return { subscribe, sendOptions, getOptions, getAuthCode, getAccessTocken, killAuthSession, getUserGuilds };
};

export default useApi;