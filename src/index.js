import Snake from './Snake'

const canvas = document.getElementById('map')
const score = document.getElementById('score')
const game = new Snake(canvas, score)

window.requestAnimationFrame(function step (time) {
  game.loop(time)
  window.requestAnimationFrame(step)
})
