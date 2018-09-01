import { AMINO_ACIDS_DATA } from '../constants'
const google = window.google

// const stats = {
//   bodyweight: 80 // in kg
// }

const getAminoShorthand = name => {
  const aminoAcid = AMINO_ACIDS_DATA.find(i => i.name === name)
  if (!aminoAcid) {
    throw new Error('No Amino Acid found for name ' + name)
  }
  return aminoAcid.shortHand
}

const drawAminoAcids = aminoAcidValues => {
  console.log('drawing Amino Acids', aminoAcidValues)
  // if (!containsAminoAcids(aminoAcidValues)) {
  //   console.log('no amino acirds, treuning')
  //   return
  // }
  // build the data table array
  const headerRow = ['Amino Acid', 'Per 100g', { role: 'annotation' }, { role: 'style' }]
  /* eslint-disable */
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
    title: 'Amino Acids',
    bar: { groupWidth: '95%' },
    legend: { position: 'none' },
    height: 400
  }

  console.log('drawing chart...')
  chart.draw(google.visualization.arrayToDataTable(chartData), options)
}

const drawMacros = values => {
  /* eslint-disable */
  const data = google.visualization.arrayToDataTable([
    ['Macro',   'per 100g'],
    ['Carbs',    values.carbs],
    ['Fat',      values.fat],
    ['Protein',  values.protein],
  ])

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

const drawCharts = data => {
  const { aminoAcidsData, macrosData } = data
  drawAminoAcids(aminoAcidsData)
  drawMacros(macrosData)
}

export {
  drawAminoAcids,
  drawMacros,
  drawCharts
}
