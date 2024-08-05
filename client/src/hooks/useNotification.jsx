import State from "../utils/State"

const useNotification = ({ notification, setNotification }) => {
  const States = State.getStates();

  function showNotification(state) {
    let message = ""
    let isError = false
    switch (state) {
      case States.SUCCESS:
        message = "Вы успешно вошли в аккаунт!"
        break;
      case States.ERROR:
        message = "Произошла ошибка при попытке войти в аккаунт!"
        isError = true
        break;
      default:
        break;
    }
    setTimeout(() => {
      setNotification(prev => new Object({ ...prev, show: false }))
    }, 2000);
    return setNotification({
      show: true,
      message,
      isError
    })
  }

  return { showNotification }
}

export default useNotification