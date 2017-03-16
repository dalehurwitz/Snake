import KeyHandler from './KeyHandler'

class Snake {
  constructor (canvas) {
    this.WIDTH = canvas.width
    this.HEIGHT = canvas.width
    this.BLOCK_WIDTH = 10
    this.ROWS = this.HEIGHT / this.BLOCK_WIDTH
    this.COLS = this.WIDTH / this.BLOCK_WIDTH
    this.COLOURS = {
      SNAKE_BODY: '#000'
    }
    this.FPS = 12

    this.ctx = canvas.getContext('2d')
    this.keyHandler = new KeyHandler(canvas)

    this.updateBuffer = 1000 / this.FPS
    this.lastTimeStamp = 0

    this.snakeBodyLength = 5
    this.snakeBody = this._getDefaultSnakeBody()
    this.direction = { x: 0, y: -1 }
  }

  update () {
    const prevSnakeHead = this.snakeBody[this.snakeBodyLength - 1]
    const newX = prevSnakeHead.x + this.direction.x
    const newY = prevSnakeHead.y + this.direction.y

    if (newX < 0 || newX > this.COLS || newY < 0 || newY > this.ROWS) {
      // Game over, we've hit a wall
      return
    }

    this.snakeBody[this.snakeBodyLength] = {
      x: newX,
      y: newY,
      dir: this.direction
    }
    this.snakeBody.shift()

    // console.log('*** UPDATE');
    // this.snakeBody.forEach(item => {
    //   console.log('x: ', item.x, 'y: ', item.y)
    // })
  }

  draw () {
    this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT)
    for (var i = 0; i < this.snakeBodyLength; i++) {
      const coords = this._convertCoordsToPixels(this.snakeBody[i])
      this._drawBlock(coords, this.COLOURS.SNAKE_BODY)
    }
  }

  loop (time) {
    if (!this.lastTimeStamp) {
      this.lastTimeStamp = time
      this.draw()
      return
    }

    if (time - this.lastTimeStamp >= this.updateBuffer) {
      this.lastTimeStamp = time
      this.update()
      this.draw()
    }
  }

  // Converts grid coordinates to map-renderable pixels
  _convertCoordsToPixels (coords) {
    return {
      x: coords.x * this.BLOCK_WIDTH,
      y: coords.y * this.BLOCK_WIDTH
    }
  }

  _drawBlock (coords, fill) {
    this.ctx.fillStyle = fill
    this.ctx.fillRect(coords.x, coords.y, this.BLOCK_WIDTH, this.BLOCK_WIDTH)
  }

  _getDefaultSnakeBody () {
    return [
      { x: 15, y: 15, dir: { x: -1, y: 0 } },
      { x: 14, y: 15, dir: { x: -1, y: 0 } },
      { x: 13, y: 15, dir: { x: -1, y: 0 } },
      { x: 12, y: 15, dir: { x: -1, y: 0 } },
      { x: 11, y: 15, dir: { x: -1, y: 0 } }
    ]
  }
}

export default Snake
