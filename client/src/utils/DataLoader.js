class DataLoader {
  constructor(setDataLoading) {
    this._setDataLoading = setDataLoading
    this._stack = {}
  }

  _checkIsAllLoaded() {
    let isDataLoading = false

    for (const key in this._stack) {
      if (Object.hasOwnProperty.call(this._stack, key)) {
        const isLoading = this._stack[key]
        if (isLoading) {
          isDataLoading = true
          break
        }
      }
    }

    return this._setDataLoading(isDataLoading)
  }

  setLoadingState(process, isLoading) {
    if (isLoading) this._stack[process] = isLoading
    else delete this._stack[process]
    return this._checkIsAllLoaded()
  }
}

export default DataLoader