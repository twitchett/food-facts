export const AMINO_ACIDS_DATA = [
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
