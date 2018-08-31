import { AMINO_ACIDS, getAminoShorthand, getAminoPercentage, getValuesMap, accumulate, containsAminoAcids } from './utils/aminoAcidUtils'
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
    const aminoAcidValues = getValuesMap(payload)

    console.log('getValuesMap', aminoAcidValues)

    return { aminoAcidValues }
  },
  // setShowAminoAcidsChart: showAminoAcidsChart => ({ showAminoAcidsChart })
}