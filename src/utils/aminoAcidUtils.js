
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

// add values from src to dest
export const accumulate = (src, dest) => {
  src.forEach(({ name, value }) => {
    if (!dest[name]) {
      dest[name] = value
    } else {
      dest[name] += value
    }
  })
  return dest
}