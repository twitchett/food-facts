import { getSearchResults, getFoodReport } from '../api'
import { cloneDeep } from 'lodash'

const storeConfig = {
  state: {
    searchResults: {
      list: [],
      total: 0
    },
    searchResultsError: null,
    selectedFoods: [],
    charts: {
      aminoAcidValues: {},
      showAminoAcidsChart: false
    }
  },
  getters: {
    hasSearchResults: state => state.searchResults.total !== 0,
    // searchResultsList: state => state.searchResults.list
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
  },
  actions: {
    async getFoodSuggestions ({ commit }, searchInput) {
      const response = await getSearchResults(searchInput)
      if (response.ok) {
        const body = await response.json()
        const searchResults = {
          total: body.total,
          list: body.list.item
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
    removeFood ({ commit, state }, ndbno) {
      const selectedFoods = state.selectedFoods.filter(food => food.ndbno !== ndbno)
      commit('updateSelectedFoods', selectedFoods)
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
