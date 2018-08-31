import { getSearchResults, getFoodReport } from '../api'
import { cloneDeep } from 'lodash'

const storeConfig = {
  state: {
    searchResults: null,
    searchResultsError: null,
    selectedFoods: [],
    charts: {
      aminoAcidValues: {},
      showAminoAcidsChart: false
    }
  },
  getters: {
    hasSearchResults: state => !!state.searchResults
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
      // actions.charts.updateChartData(selectedFoods)
    },
    removeFood (state, payload) {
      const newSelectedFoods = state.selectedFoods.filter(food => food !== payload)
      state.selectedFoods = newSelectedFoods
      // actions.charts.updateChartData(selectedFoods)
    },
  },
  actions: {
    async getFoodSuggestions ({ commit }, searchInput) {
      const response = await getSearchResults(searchInput)
      if (response.ok) {
        const body = await response.json()
        commit('setSearchResults', body)
      } else {
        // setError(response)
        window.alert(JSON.stringify(response))
      }
    },
    async selectFood ({ commit }, food) {
      const response = await getFoodReport(food)
      if (response.ok) {
        const body = await response.json()
        if (body && body.foods && body.foods.length) {
          if (body.foods.length > 1) {
            console.warn('API returned more than 1 food for ndbno ' + food)
          }
          commit('addFood', parseFoodResponse(body.foods[0].food))
        }
      } else {
        // setError(response)
        window.alert(JSON.stringify(response))
      }
    },
    setFoodQuantity ({ commit, state }, { food, quantity }) {
      const newFood = cloneDeep(food)
      newFood.quantity = quantity
      const newSelectedFoods = state.selectedFoods.map(i => i === food ? newFood : i) // TODO FIX! way of uniquely identify items
      // const { selectedFoods } = actions.reduce(s => ({ selectedFoods: newSelectedFoods }))
      commit('updateSelectedFoods', newSelectedFoods)
    }
  }
}

const parseFoodResponse = food => {
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
