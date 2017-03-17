class KeyHandler {
  constructor (elem) {
    this.keyIsDown = false
    this.selectedKey = null
    this.listeners = []

    document.addEventListener('keydown', (e) => {
      this.selectedKey = e.keyCode
      this._publish()
    }, false)

    document.addEventListener('keyup', (e) => {
      this.selectedKey = null
    }, false)
  }

  onKeypress (cb) {
    this.listeners.push(cb)
  }

  _publish () {
    this.listeners.forEach(listener => listener(this.selectedKey))
  }
}

export default KeyHandler
