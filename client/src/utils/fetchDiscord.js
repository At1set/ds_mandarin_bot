import axios from "axios"

const dsApi = "https://discord.com/api"
const dsImgApi = "https://cdn.discordapp.com"

const _requestHandler = async (request) => {
  let res = {
    data: null,
    error: null
  }

  try {
    res.data = (await request).data
  } catch (error) {
    res.error = error
  }

  return res
}

const getUser = async () => {
  const access_token = localStorage.getItem("access_token")

  if (!access_token) return {
    data: null,
    error: new Error("User is unauthorized!")
  };
  const request = axios.get(`${dsApi}/users/@me`, {
    // headers: {
    //   "Authorization": `Bearer ${access_token}`
    // }
  })

  return await _requestHandler(request)
}

export { getUser }