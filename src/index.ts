import App from './app'

const canvas = document.getElementById('canvas') as HTMLCanvasElement
canvas.width = 500
canvas.height = 500
const app = new App(canvas)
app.run()