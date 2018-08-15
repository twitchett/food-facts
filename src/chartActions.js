import { AMINO_ACIDS, getAminoShorthand, getAminoPercentage, getEmptyMap, accumulate, containsAminoAcids } from './utils/aminoAcidUtils'
import { EventBus } from './EventBus'

export const chartActions = {
  updateChartData: payload => (state, actions) => {
    // Update state
    const { setAminoAcidData, setShowAminoAcidsChart } = actions
    const { aminoAcidValues } = setAminoAcidData(payload)
    const hasAminoAcids = containsAminoAcids(aminoAcidValues)
    // setShowAminoAcidsChart(hasAminoAcids)

    EventBus.emit('amino_acids_changed', aminoAcidValues)
    EventBus.emit('macros_changed', payload)
  },
  setAminoAcidData: payload => (state, actions) => {
    // extracts an array of amino acid nutrient objects from the food report
    const extractAminoAcids = food => food.nutrients.filter(nutrient => AMINO_ACIDS.includes(nutrient.name))
    
    const aminoAcidValues = payload
      .map(extractAminoAcids)
      .reduce(accumulate, {})

    return { aminoAcidValues }
  },
  // setShowAminoAcidsChart: showAminoAcidsChart => ({ showAminoAcidsChart })
}