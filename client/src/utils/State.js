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

  get({ isLoading, error, data }) {
    if (!isLoading && !error && !data) this.state = null
    if (!isLoading && !error && data) this.state = this.States.SUCCESS
    if (!isLoading && error && !data) this.state = this.States.ERROR
    if (!isLoading && error && data) this.state = this.States.ERROR
    if (isLoading && !error && !data) this.state = this.States.LOADING
    if (isLoading && !error && data) this.state = this.States.LOADING
    if (isLoading && error && !data) this.state = this.States.ERROR
    if (isLoading && error && data) this.state = this.States.ERROR

    return this.state
  }
}

export default new State()