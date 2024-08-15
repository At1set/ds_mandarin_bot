// Utils
import State from "../utils/State";

const useLoading = ({ setState }) => {
  async function startLoading(loadFunc, timeOut="10min", ignore_state=false) {
    const error = new Error("ValueError: the value of {timeOut} is invalid!")

    if (typeof timeOut === 'string') {
      let timeMeasurement = null
      if (timeOut.includes("s")) timeMeasurement = "s"
      else if (timeOut.includes("min")) timeMeasurement = "min"

      if (timeMeasurement === null) throw error

      const timeCount = +timeOut.replace(timeMeasurement, "")
      if (isNaN(timeCount)) throw error

      if (timeMeasurement === "s") timeOut = 1000 * timeCount
      else if (timeMeasurement === "min") timeOut = 60 * 1000 * timeCount
      else throw error
    }

    function setIsLoading(value) {
      loadingData.isLoading = value
      if (ignore_state) return
      return setState(State.get(loadingData))
    }
    function setError(value) {
      loadingData.error = value
      if (ignore_state) return
      return setState(State.get(loadingData))
    }
    function setData(value) {
      loadingData.data = value
      if (ignore_state) return
      return setState(State.get(loadingData))
    }

    let loadingData = {
      isLoading: true,
      error: null,
      data: null,
    }

    setIsLoading(true)

    try {
      const promise = new Promise((resolve, reject) => {
        const timerId = setTimeout(() => {
          reject(new Error(`Превышено максимальное время ожидания: ${timeOut}ms`));
        }, timeOut);

        loadFunc().then((res) => {
          clearTimeout(timerId);
          resolve(res);
        }).catch((err) => {
          clearTimeout(timerId);
          reject(err);
        })
      });
      const res = await promise;
      setData(res);
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
      return loadingData
    }
  }

  return { startLoading }
};

export default useLoading;