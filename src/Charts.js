import { EventBus } from './EventBus'
import { AMINO_ACIDS, getAminoShorthand, getAminoPercentage, accumulate, containsAminoAcids } from './utils/aminoAcidUtils'
const google = window.google

const stats = {
  bodyweight: 80  // in kg
}

console.log('EventBus', EventBus)

class Charts {

  constructor() {
    this.storeEvent = this.storeEvent.bind(this)
    this.drawMacros = this.drawMacros.bind(this)
    this.drawAminoAcids = this.drawAminoAcids.bind(this)
    this.events = []

    const unsubHandlers = []
    unsubHandlers.push(EventBus.subscribe('amino_acids_changed', payload => this.storeEvent('amino_acids_changed', payload)))
    unsubHandlers.push(EventBus.subscribe('macros_changed', payload => this.storeEvent('macros_changed', payload)))

    const intervalId = window.setInterval(() => {
      if (window.loaded) {
        window.clearInterval(intervalId)
        unsubHandlers.forEach(unsubHandler => unsubHandler())
        EventBus.subscribe('amino_acids_changed', this.drawAminoAcids)
        EventBus.subscribe('macros_changed', this.drawMacros)
        if (this.events) {
          this.events.forEach(([name, payload]) => {
            if (name === 'amino_acids_changed') this.drawAminoAcids(payload)
            if (name === 'macros_changed') this.drawMacros(payload)
          })
          this.events = []
        }
      }
    }, 500)
    
  }

  storeEvent (name, e) {
    this.events.push([name, e])
  }

  drawAminoAcids (aminoAcidValues) {
    // build the data table array
    const headerRow = ['Amino Acid', 'Per 100g', { role: 'annotation' }, { role: 'style' }]
    let chartData = Object.keys(aminoAcidValues)
      .map(name => [
          name,
          aminoAcidValues[name],
          getAminoShorthand(name),
          'green'
        ]
      )

    chartData = [headerRow, ...chartData]

    const chart = new google.visualization.ColumnChart(document.getElementById('aminoAcidsChart'))
    const options = {
      title: "Amino Acids",
      bar: { groupWidth: "95%" },
      legend: { position: "none" },
      height: 400
    }

    console.log('drawing chart...')
    chart.draw(google.visualization.arrayToDataTable(chartData), options)
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

const initializeCharts = (actions) => {
  return new Charts(actions)
}

export { initializeCharts }