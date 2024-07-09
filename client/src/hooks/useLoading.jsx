import { useState } from "react";

// Utils
import State from "../utils/State";

const useLoading = () => {
  const [ state, setState ] = useState(null)

  async function startLoading(loadFunc, timeOut, breaker=null) {
    function setIsLoading(value) {
      loadingData.isLoading = value
      return setState(State.get(loadingData))
    }
    function setError(value) {
      loadingData.error = value
      return setState(State.get(loadingData))
    }
    function setData(value) {
      loadingData.data = value
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
        if (breaker) {
          breaker.funcitons.push(() => reject("Canceling promise..."))
        }

        const timerId = setTimeout(() => {
            reject(new Error('`Превышено максимальное время ожидания: ' + `${timeOut}ms`));
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

  return [ state, setState, startLoading ]
};

export default useLoading;