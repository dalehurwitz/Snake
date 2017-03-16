class KeyHandler {
  constructor (elem) {
    this._elem = elem
    this.keyIsDown = false

    window.addEventListener('keypress', (e) => {
      console.log(e);
      if (!this.keyIsDown) {
        this.keyIsDown = true
        console.log(e)
      }
    }, false)

    this._elem.addEventListener('keyup', (e) => {
      this.keyIsDown = false
    }, false)
  }
}

export default KeyHandler
