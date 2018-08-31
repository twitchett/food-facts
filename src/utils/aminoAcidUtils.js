import { isEmpty, every, values, keyBy, mergeWith } from 'lodash'

// console.log('isEmpty', isEmpty)

// RDA in mg per 1kg of bodyweight
const AMINO_ACIDS_DATA = [
  { name: 'Isoleucine', rda: 19, shortHand: 'Ala' },
  { name: 'Leucine', rda: 43, shortHand: 'Leu' },
  { name: 'Lysine', rda: 38, shortHand: 'Lys' },
  { name: 'Methionine', rda: 19, shortHand: 'Met' },
  { name: 'Phenylalanine', rda: 33, shortHand: 'Phe' },
  { name: 'Threonine', rda: 20, shortHand: 'Thr' },
  { name: 'Tryptophan', rda: 5, shortHand: 'Try' },
  { name: 'Valine', rda: 24, shortHand: 'Val' },
  { name: 'Histidine', rda: 14, shortHand: 'His' }
]

const createEmptyValuesMap = () => AMINO_ACIDS_DATA.reduce((map, { name }) => Object.assign(map, { [name]: 0 }), {})

export const AMINO_ACIDS = AMINO_ACIDS_DATA.map(i => i.name)

export const getAminoShorthand = name => {
  const aminoAcid = AMINO_ACIDS_DATA.find(i => i.name === name)
  if (!aminoAcid) {
    throw new Error('No Amino Acid found for name ' + name)
  }
  return aminoAcid.shortHand
}

export const getAminoPercentage = name => {
  return 'lol'
}

/*
* Add values from src to dest
*/
export const accumulate = (dest, src) => {
  src.forEach(({ name, value }) => {
    if (!dest[name]) {
      dest[name] = value
    } else {
      dest[name] += value
    }
  })
  return dest
}

/*
* Returns true if the object contains entries and they are all > 0
*/
export const containsAminoAcids = valuesMap => {
  if (isEmpty(valuesMap)) {
    return false
  }
  if (every(values(valuesMap), i => i === 0)) {
    return false
  }
  return true
}

export const getValuesMap = foods => {
    const food = foods[0]
    const { selectedMeasure, quantity, nutrients } = food
    const foodMass = quantity * selectedMeasure.eqv
    console.log(`foodMass: ${quantity} * ${selectedMeasure.eqv} = ${foodMass}`)

    return AMINO_ACIDS
      // create array of { name, value } pairs for each amino acid
      .map(aminoAcid => {
        const nutrient = nutrients.find(item => item.name === aminoAcid)
        let amount
        if (!nutrient) {
          amount = 0
        } else {
          amount = (() => getPercentage(nutrient, foodMass))()
        }  
        console.log('found food nutrietn: ', nutrient.name, nutrient)
        return { aminoAcid, amount }
      })
      // reduce array of objects to single object
      .reduce((map, { aminoAcid, amount }) => Object.assign(map, { [aminoAcid]: amount }), {})
}

const getPercentage = (nutrient, foodMass) => {
  console.log('calculating amount: ', nutrient.name)
  const { name, value: valuePer100g } = nutrient
  const { rda } = AMINO_ACIDS_DATA.find(item => item.name === name)
  const amount = valuePer100g * (foodMass/100)
  return (amount/rda) * 100
}
