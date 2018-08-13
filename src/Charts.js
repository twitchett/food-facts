
import { EventBus } from './EventBus'
import { AMINO_ACIDS, getAminoShorthand, getAminoPercentage, accumulate, hasAminoAcids } from './utils/aminoAcidUtils'
const google = window.google

const stats = {
  bodyweight: 80  // in kg
}

class Charts {

  constructor() {
    this.storeEvent = this.storeEvent.bind(this)
    this.drawMacros = this.drawMacros.bind(this)
    this.drawAminoAcids = this.drawAminoAcids.bind(this)
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
    this.drawAminoAcids(foods)
  }

  drawAminoAcids (foods) {
    // extracts an array of amino acid nutrient objects from the food report
    const extractAminoAcids = food => food.nutrients.filter(nutrient => AMINO_ACIDS.includes(nutrient.name))
    
    const aminoAcidValues = foods
      .map(extractAminoAcids)
      .reduce(((totals, aminoAcids) => accumulate(aminoAcids, totals)), {})

    if (!hasAminoAcids(aminoAcidValues)) {
      console.log('No Amino Acids')
      return
    }

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
    }

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

export { Charts }