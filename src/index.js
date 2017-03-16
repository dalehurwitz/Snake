import Snake from './Snake'

const canvas = document.getElementById('map')
const game = new Snake(canvas)

window.requestAnimationFrame(function step (time) {
  game.loop(time)
  window.requestAnimationFrame(step)
})
