import { mergeWith, pick } from 'lodash'
import { EventBus } from './EventBus'
const google = window.google

const stats = {
  bodyweight: 80  // in kg
}

// RDA in mg per 1kg of bodyweight
const AMINO_ACIDS = [
  { name: 'Isoleucine', rda: 19 },
  { name: 'Leucine', rda: 43 },
  { name: 'Lysine', rda: 38 },
  { name: 'Methionine', rda: 19 },
  { name: 'Phenylalanine', rda: 33 },
  { name: 'Threonine', rda: 20 },
  { name: 'Tryptophan', rda: 5 },
  { name: 'Valine', rda: 24 },
  { name: 'Histidine', rda: 14 }
]

// const AMINO_ACIDS = {
//   Isoleucine: 
//   Leucine:
//   Lysine:
//   Methionine:
//   Phenylalanine:
//   Threonine:
//   Tryptophan:
//   Valine:
//   Histidine:
// }

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
    this.drawAminoAcids(foods)
    this.drawMacros(foods)
  }

  drawAminoAcids (foods) {
    const headerRow = ['Amino Acid', 'Per 100g']
    const keys = AMINO_ACIDS.map(i => i.name)

    // add values from src to dest
    const accumulate = (src, dest) => {
      src.forEach(({ name, value }) => {
        if (!dest[name]) {
          dest[name] = value
        } else {
          dest[name] += value
        }
      })
      return dest
    }

    // extract an array of amino acid nutrient objects from the food report
    const extractAminoAcids = food => food.nutrients.filter(nutrient => keys.includes(nutrient.name))
    
    const aminoAcidValues = foods
      .map(extractAminoAcids)
      .reduce(((totals, aminoAcids) => accumulate(aminoAcids, totals)), {})
     
    const chartData = Object.keys(aminoAcidValues)
      .map(key => [key, aminoAcidValues[key]])

    chartData.unshift(headerRow)

    console.log('chart data', chartData)
  //   const data = google.visualization.arrayToDataTable([
  //      ['Amino Acid', 'per 100g', { role: 'style' }, { role: 'annotation' } ],
  //      ['Copper', 8.94, '#b87333', 'Cu' ],
  //      ['Silver', 10.49, 'silver', 'Ag' ],
  //      ['Gold', 19.30, 'gold', 'Au' ],
  //      ['Platinum', 21.45, 'color: #e5e4e2', 'Pt' ]
  //   ])
  // }
    const options = {
      title: 'Amino Acids'
    }
    const chart = new google.visualization.ColumnChart(document.getElementById('aminoAcidsChart'))

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