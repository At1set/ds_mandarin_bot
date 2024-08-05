// Components, React librart
import React, { useState } from "react";
import Button from "../UI/Button/Button";
import Loading_circle from "../Loading_circle//Loading_circle";

// Styles
import cls from "./ChangingDetected.module.scss"

// Hooks
import useApi from "../../hooks/useApi"
import useLoading from "../../hooks/useLoading";

// Utils
import State from "../../utils/State";

const ChangingDetected = ({isActive, setOptionsChanged, getFormData, setFromElemVal, setData, oldData}) => {
  const States = State.getStates()
  const { subscribe, sendOptions } = useApi();
  const [ state, setState ] = useState(null);
  const { startLoading } = useLoading({ state, setState });
  
  const saveData = async (data) => {
    console.log("\nСохранение настроек...")
    const controller = new AbortController();
    const { signal } = controller
    const startTime = performance.now()

    const result = startLoading(() => subscribe(signal), 10_000) // SUBSCRIBE
    result.then(e => console.log(e))

    await new Promise(resolve => setTimeout(resolve, 500))
    
    let loadingData = await startLoading(() => sendOptions(data, signal), 5000) // SEND DATA
    console.log(loadingData);
    if (loadingData.error) {
      console.log(loadingData.error);
      console.log("Сервер не ответил на sendOptions!");
      return controller.abort("Сервер не ответил на sendOptions!")
    } // BREAK SUBSCRIBE

    return await result.then(async (loadingData) => {
      if (loadingData.error) return

      const delay = startTime - performance.now()
      if (delay < 1000) {
        setState(States.LOADING)
        await new Promise(resolve => setTimeout(resolve, 1500))
        let { status } = loadingData.data
        if (status === "ok") setState(States.SUCCESS)
        else setState(States.ERROR)
      }
      return loadingData.data
    }) 
  }

  const handleSave = async () => {
    if (!isActive) return

    const data = getFormData()
    setData(data)
    let res = await saveData(data)
    console.log(res);
    if (!res) setData(oldData)
    else setData(res.message)
    setTimeout(() => {
      setOptionsChanged(false)
      setState(null)
    }, 2000);
  }

  const handleCancel = () => {
    if (state === States.CANCEL) return
    setState(States.CANCEL)
    setTimeout(() => {
      setFromElemVal(oldData);
      setOptionsChanged(false);
      setState(null)
    }, 1000);
  };

  let classes = ["ChangingDetected", cls.ChangingDetected]
  if (isActive) classes.push(cls._active);
  (state === States.SUCCESS) && classes.push(cls._successfully);
  (state === States.ERROR)   && classes.push(cls._error);
  (state === States.CANCEL)  && classes.push(cls._cancel);
  if (state === States.RELOAD) {
    classes = [cls.ChangingDetected]
    if (isActive) classes.push(cls._active);
  }
  
  function getStatusText() {
    if (state === States.ERROR) return "Произошла ошибка!"
    if (state === States.SUCCESS) return "Настройки применены!"
    return "Обнаружены изменения!"
  }

  function getButtonsStyle() {
    let res = {visibility: state === States.SUCCESS || state === States.ERROR ? "hidden" : "visible"}
    if (!isActive) res.visibility = "hidden"
    return res
  }
  const ButtonsStyle = getButtonsStyle()

  function testServer(_, count=0) {
    let DATA = {...oldData, time: count}
    console.log(DATA);
    setTimeout(() => {
      saveData(DATA)
      testServer(_, count+1)
    }, 2000);
  }
  
  return (
    <div className={classes.join(" ")}>
      <p>
        {getStatusText()}
      </p>
      <Button
      style={ButtonsStyle}
      disabled={[States.LOADING, States.SUCCESS].includes(state) || !isActive}
      onClick={handleCancel}>Отменить</Button>
      <Button
      className={state === States.LOADING ? cls._loading : ""}
      style={ButtonsStyle}
      disabled={[States.LOADING, States.SUCCESS].includes(state) || !isActive}
      onClick={handleSave}>
        <span>Сохранить</span>
        <Loading_circle className={cls.Loading_circle} />
      </Button>
    </div>
  )
}

export default ChangingDetected