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

  const sendOptions = async (data, signal) => {
    const response = await axios.patch(`http://192.168.0.191:8000/api/updateConfig/${guildID}`, JSON.stringify(data),
    {
      signal,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  };

  return [ subscribe, sendOptions ];
};

export default useApi;