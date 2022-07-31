import { Chart, LineElement, PointElement, LineController, CategoryScale, LinearScale, Filler, Legend } from 'chart.js'

export default defineNuxtPlugin(() => {
  Chart.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, Filler, Legend)
})
