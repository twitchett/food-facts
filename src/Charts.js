import { EventBus } from './EventBus'

const google = window.google

class Charts {

  constructor() {
    this.storeEvent = this.storeEvent.bind(this)
    this.drawMacros = this.drawMacros.bind(this)
    this.drawAll = this.drawAll.bind(this)

    EventBus.subscribe('foods_updated', this.storeEvent)

    const intervalId = window.setInterval(() => {
      if (window.loaded) {
        window.clearInterval(intervalId)
        EventBus.unsubscribe('foods_updated', this.storeEvent)
        EventBus.subscribe('foods_updated', this.drawAll)
        if (this.foods) {
          this.drawAll(this.foods)
          this.foods = undefined
        }
      }
    }, 500)
    
  }

  storeEvent (foods) {
    this.foods = foods
  }

  drawAll (foods) {
    this.drawMacros(foods)
  }

  drawMacros (foods) {
    const getMacro = (foods, name) => {
       return foods.map(food => food.nutrients.find(n => n.name === name))
        .reduce(((total, nutrient) => nutrient.value + total), 0)
    }

    const data = google.visualization.arrayToDataTable([
      ['Macro',   'per 100g'],
      ['Carbs',    getMacro(foods, 'Carbohydrate, by difference')],
      ['Fat',      getMacro(foods, 'Total lipid (fat)')],
      ['Protein',  getMacro(foods, 'Protein')],
    ]);

    const options = {
      title: 'Macros per 100g',
      legend: 'left',
      is3D: true,
      width: 600,
      height: 400
    }

    const macrosChart = new google.visualization.PieChart(document.getElementById('macrosChart'))
    macrosChart.draw(data, options)
  }
}

export { Charts }