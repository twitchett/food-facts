import { isEmpty, every, values, keyBy } from 'lodash'

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

export const AMINO_ACIDS = AMINO_ACIDS_DATA.map(i => i.name)

// export const getEmptyMap = AMINO_ACIDS_DATA.reduce((map, { name }) => ({ ...map, [name]: 0 }), {});

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