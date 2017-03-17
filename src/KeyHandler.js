const KEY_CODES = {
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,
  A: 64,
  W: 87,
  D: 68,
  S: 83
}

class KeyHandler {
  constructor (elem) {
    this.keyIsDown = false
    this.selectedKey = null
    this.listeners = []

    document.addEventListener('keydown', (e) => {
      this.selectedKey = e.keyCode
      this._publish(this._mapKey(this.selectedKey))
    }, false)

    document.addEventListener('keyup', (e) => {
      this.selectedKey = null
    }, false)
  }

  onPress (cb) {
    this.listeners.push(cb)
  }

  _mapKey (keyCode) {
    switch (keyCode) {
      case KEY_CODES.LEFT:
      case KEY_CODES.A:
        return 'left'
      case KEY_CODES.RIGHT:
      case KEY_CODES.D:
        return 'right'
      case KEY_CODES.UP:
      case KEY_CODES.W:
        return 'up'
      case KEY_CODES.DOWN:
      case KEY_CODES.S:
        return 'down'
      default:
        return null
    }
  }

  _publish (direction) {
    if (direction) {
      this.listeners.forEach(listener => listener(direction))
    }
  }
}

export default KeyHandler
