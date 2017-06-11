import KeyHandler from './KeyHandler'

class Snake {
  constructor (canvas, scoreContainer) {
    this.WIDTH = canvas.width
    this.HEIGHT = canvas.height
    this.TILE_WIDTH = 10
    this.ROWS = this.HEIGHT / this.TILE_WIDTH
    this.COLS = this.WIDTH / this.TILE_WIDTH
    this.COLOURS = {
      SNAKE_BODY: '#000'
    }
    this.FPS = 12

    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.scoreContainer = scoreContainer

    this.keyHandler = new KeyHandler(canvas)

    this.updateBuffer = 1000 / this.FPS
    this.lastTimeStamp = 0

    this.snakeBodyLength = 5
    this.snakeBody = this._getDefaultSnakeBody()

    this.foodIndex = null
    this.foodTimer = null
    this.foodLifeTime = 5000

    this.selectedKey = null
    this.direction = { x: -1, y: 0 }
    this.score = 0
    this.gameOver = false

    this._setupKeyHandler()
  }

  _resetGame () {
    this.lastTimeStamp = 0
    this.snakeBodyLength = 5
    this.snakeBody = this._getDefaultSnakeBody()
    this.direction = { x: -1, y: 0 }
    this.score = 0
    this.gameOver = false
    this.selectedKey = null
    this._updateScore(true)
    this._generateFood()
  }

  _setupKeyHandler () {
    this.keyHandler.onPress(key => {
      this.selectedKey = key
    })
  }

  _handleGameOverState () {
    this.gameOver = true
    if (this.foodTimer) {
      clearInterval(this.foodTimer)
    }

    const _onCanvasClick = () => {
      this._resetGame()
      this.canvas.removeEventListener('click', _onCanvasClick)
      this.canvas.removeEventListener('keydown', _onCanvasClick)
    }

    // Add a little delay in case the game ends just before user tries to change direction
    setTimeout(() => {
      this.canvas.addEventListener('click', _onCanvasClick)
      this.canvas.addEventListener('keydown', _onCanvasClick)
    }, 100)
  }

  _updateScore (init) {
    if (!init) {
      this.score++
    }
    this.scoreContainer.innerHTML = this.score
  }

  _headHasCollidedWithBody (headTileIndex) {
    for (let i = 0; i < this.snakeBodyLength; i++) {
      if (headTileIndex === this.snakeBody[i].tileIndex) {
        return true
      }
    }
    return false
  }

  // Updates position and length of the snake, detects collisions and food collection
  _update () {
    if (this.gameOver) {
      return
    }

    this._updateDirection()

    const prevSnakeHead = this.snakeBody[this.snakeBodyLength - 1]
    const newCoords = {
      x: prevSnakeHead.x + this.direction.x,
      y: prevSnakeHead.y + this.direction.y
    }
    const newTileIndex = this._convertCoordsToTileIndex(newCoords)

    if (newCoords.x < 0 ||
      newCoords.x >= this.COLS ||
      newCoords.y < 0 ||
      newCoords.y >= this.ROWS ||
      this._headHasCollidedWithBody(newTileIndex)) {
      this._handleGameOverState()
      return
    }

    // Update the position of the snake head
    this.snakeBody[this.snakeBodyLength] = this._buildSnakeBodySegment(newTileIndex, this.direction)

    // Snake has collided with a food item
    if (newTileIndex === this.foodIndex) {
      this._updateScore()
      this._generateFood()
      this.snakeBodyLength++
    } else {
      // Remove the last segment of the snake tail
      this.snakeBody.shift()
    }
  }

  _draw () {
    this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT)
    this._drawFood()

    for (var i = 0; i < this.snakeBodyLength; i++) {
      this._drawTile(this.snakeBody[i], this.COLOURS.SNAKE_BODY)
    }

    if (this.gameOver) {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT)
      this.ctx.font = 'bold 16px sans-serif'
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'
      this.ctx.fillStyle = 'black'
      this.ctx.fillText('GAME OVER', this.WIDTH / 2, this.HEIGHT / 2 - 12)
      this.ctx.font = '16px sans-serif'
      this.ctx.fillText('Press any key to start a new game', this.WIDTH / 2, this.HEIGHT / 2 + 12)
    }
  }

  loop (time) {
    if (this.gameOver) return

    // On first run
    if (!this.lastTimeStamp) {
      this.lastTimeStamp = time
      this._draw()
      return
    }

    if (time - this.lastTimeStamp >= this.updateBuffer) {
      this.lastTimeStamp = time
      this._update()
      this._draw()
    }
  }

  _updateDirection () {
    if (!this.selectedKey) {
      return
    }

    if (this.selectedKey === 'left' && this.direction.x !== 1) {
      this.direction = { x: -1, y: 0 }
    } else if (this.selectedKey === 'right' && this.direction.x !== -1) {
      this.direction = { x: 1, y: 0 }
    } else if (this.selectedKey === 'up' && this.direction.y !== 1) {
      this.direction = { x: 0, y: -1 }
    } else if (this.selectedKey === 'down' && this.direction.y !== -1) {
      this.direction = { x: 0, y: 1 }
    }

    this.selectedKey = null
  }

  _generateFood () {
    // Generate an array of indices for each tile
    const allTileIndices = [...Array(this.ROWS * this.COLS).keys()]
    // Create an array for all tile indices of the snake body
    const occupiedTileIndices = this.snakeBody.map(tile => tile.tileIndex)
    // Make sure we place this food item in a new location
    occupiedTileIndices.push(this.foodIndex || -1)
    // Filter snake body tiles from all tiles
    const filteredTileIndices = allTileIndices.filter(index => occupiedTileIndices.indexOf(index) === -1)
    // Choose a random index from the filtered array to place the food
    this.foodIndex = filteredTileIndices[Math.floor(Math.random() * filteredTileIndices.length)]

    if (this.foodTimer) {
      clearInterval(this.foodTimer)
    }

    this.foodTimer = setTimeout(() => {
      this._generateFood()
    }, this.foodLifeTime)
  }

  _drawFood () {
    const coords = this._convertTileIndexToCoords(this.foodIndex)
    this._drawTile(coords, 'red')
  }

  _convertTileIndexToCoords (tileIndex) {
    return {
      x: tileIndex % this.COLS,
      y: Math.floor(tileIndex / this.COLS)
    }
  }

  _convertCoordsToTileIndex (coords) {
    return coords.y * this.COLS + coords.x
  }

  // Converts grid coordinates to map-renderable pixels
  _convertCoordsToPixels (coords) {
    return {
      x: coords.x * this.TILE_WIDTH,
      y: coords.y * this.TILE_WIDTH
    }
  }

  _drawTile (coords, fill) {
    const pixelCoords = this._convertCoordsToPixels(coords)
    this.ctx.fillStyle = fill
    this.ctx.fillRect(pixelCoords.x, pixelCoords.y, this.TILE_WIDTH, this.TILE_WIDTH)
  }

  _buildSnakeBodySegment (tileIndex, dir = { x: -1, y: 0 }) {
    return {
      ...this._convertTileIndexToCoords(tileIndex),
      dir,
      tileIndex
    }
  }

  _getDefaultSnakeBody () {
    const midPoint = this.ROWS * this.COLS / 2 + this.COLS / 2
    return [
      this._buildSnakeBodySegment(midPoint + 2),
      this._buildSnakeBodySegment(midPoint + 1),
      this._buildSnakeBodySegment(midPoint),
      this._buildSnakeBodySegment(midPoint - 1),
      this._buildSnakeBodySegment(midPoint - 2)
    ]
  }
}

export default Snake
