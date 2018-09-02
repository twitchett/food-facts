import { AMINO_ACIDS_DATA } from '../constants'
import { getSearchResults, getFoodReport } from '../api'
import { isEmpty, every, values, cloneDeep } from 'lodash'

const storeConfig = {
  state: {
    searchResults: {
      list: [],
      total: 0
    },
    searchResultsError: null,
    selectedFoods: [],
    charts: {
      aminoAcidsData: {},
      macrosData: {}
    }
  },
  getters: {
    showAminoAcidsChart: state => true,
    hasSearchResults: state => state.searchResults.total !== 0,
    hasAminoAcids: state => {
      const { aminoAcidsData } = state.charts
      if (isEmpty(aminoAcidsData)) {
        return false
      }
      if (every(values(aminoAcidsData), i => i === 0)) {
        return false
      }
      return true
    }
  },
  mutations: {
    setSearchResults (state, payload) {
      state.searchResults = payload
    },
    updateSelectedFoods (state, payload) {
      state.selectedFoods = payload
    },
    addFood (state, payload) {
      state.selectedFoods = [...state.selectedFoods, payload]
    },
    setChartData (state, payload) {
      state.charts = payload
    }
  },
  actions: {
    async getFoodSuggestions ({ commit }, searchInput) {
      const response = await getSearchResults(searchInput)
      if (response.ok) {
        const body = await response.json()
        const searchResults = {
          total: body.total,
          list: (body.list && body.list.item) || 0
        }
        commit('setSearchResults', searchResults)
      } else {
        // setError(response)
        window.alert(JSON.stringify(response))
      }
    },
    async selectFood ({ commit }, ndbno) {
      const response = await getFoodReport(ndbno)
      if (response.ok) {
        const body = await response.json()
        if (body && body.foods && body.foods.length) {
          if (body.foods.length > 1) {
            console.warn('API returned more than 1 food for ndbno ' + ndbno)
          }
          commit('addFood', parseFoodResponse(body.foods[0].food))
        }
      } else {
        // setError(response)
        window.alert(JSON.stringify(response))
      }
    },
    removeFood ({ commit, state }, food) {
      const selectedFoods = state.selectedFoods.filter(f => f !== food)
      commit('updateSelectedFoods', selectedFoods)
    },
    setFoodQuantity ({ commit, state }, { food, quantity }) {
      const newFood = cloneDeep(food)
      newFood.quantity = quantity
      const newSelectedFoods = state.selectedFoods.map(i => i === food ? newFood : i) // TODO FIX! way of uniquely identify items
      commit('updateSelectedFoods', newSelectedFoods)
    },
    updateFoodMeasure ({ commit, state }, { food, measure }) {
      const newFood = cloneDeep(food)
      newFood.selectedMeasure = measure
      const newSelectedFoods = state.selectedFoods.map(i => i === food ? newFood : i) // TODO FIX! way of uniquely identify items
      commit('updateSelectedFoods', newSelectedFoods)
    },
    updateChartData ({ commit }, foods) {
      // Macros
      const macrosData = {
        carbs: getMacro(foods, 'Carbohydrate, by difference'),
        fat: getMacro(foods, 'Total lipid (fat)'),
        protein: getMacro(foods, 'Protein')
      }

      // Amino Acids
      const aminoAcidsData = foods
        .map(getAminoAcidsForFood)
        .reduce(accumulate, createEmptyValuesMap())

      const chartData = {
        macrosData,
        aminoAcidsData
      }

      commit('setChartData', chartData)
    }
  }
}

const createEmptyValuesMap = () => AMINO_ACIDS_DATA.reduce((map, { name }) => Object.assign(map, { [name]: 0 }), {})

const accumulate = (dest, src) => {
  Object
    .entries(src)
    .forEach(([key, value]) => {
      dest[key] += value
    })
  return dest
}

const getAminoAcidsForFood = food => {
  const { selectedMeasure, quantity, nutrients } = food
  const foodMass = quantity * selectedMeasure.eqv
  console.log(`foodMass: ${quantity} * ${selectedMeasure.eqv} = ${foodMass}`)

  return AMINO_ACIDS_DATA
    // create array of { name, value } pairs for each amino acid
    .map(aminoAcid => {
      const nutrient = nutrients.find(item => item.name === aminoAcid.name)
      let amount
      if (!nutrient) {
        amount = 0
      } else {
        amount = (() => getPercentage(nutrient, aminoAcid, foodMass))()
      }
      return {
        aminoAcid: aminoAcid.name,
        amount
      }
    })
    // reduce array of objects to single object
    .reduce((map, { aminoAcid, amount }) => Object.assign(map, { [aminoAcid]: amount }), {})
}

const getMacro = (foods, name) => {
  return foods.map(food => food.nutrients.find(n => n.name === name))
    .reduce((total, nutrient) => nutrient.value + total, 0)
}

const getPercentage = (nutrient, aminoAcid, foodMass) => {
  console.log('calculating amount: ', nutrient.name)
  const { value: valuePer100g } = nutrient
  const { rda } = aminoAcid
  const amount = valuePer100g * (foodMass / 100)
  return (amount / rda) * 100
}

const parseFoodResponse = food => {
  console.log('parsing food', food)
  if (food.nutrients && food.nutrients.length > 0) {
    food.measures = Object.values(food.nutrients[0].measures)
    food.selectedMeasure = food.measures[0]
    food.quantity = 1
  } else {
    console.warn('No measures for food', food)
  }
  return food
}

export default storeConfig
