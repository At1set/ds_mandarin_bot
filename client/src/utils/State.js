class State {
  constructor() {
    this.States = {
      ERROR: "ERROR",
      SUCCESS: "SUCCESS",
      LOADING: "LOADING",
      CANCEL: "CANCEL",
      RELOAD: "RELOAD"
    }
    this.state = null
  }

  getStates() {
    return this.States
  }

  get({ isLoading, error, newData }) {
    if (!isLoading && !error && !newData) this.state = null
    if (!isLoading && !error && newData) this.state = this.States.SUCCESS
    if (!isLoading && error && !newData) this.state = this.States.ERROR
    if (!isLoading && error && newData) this.state = this.States.ERROR
    if (isLoading && !error && !newData) this.state = this.States.LOADING
    if (isLoading && !error && newData) this.state = this.States.LOADING
    if (isLoading && error && !newData) this.state = this.States.ERROR
    if (isLoading && error && newData) this.state = this.States.ERROR

    return this.state
  }
}

export default new State()