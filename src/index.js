import { h, app } from 'hyperapp'
import devtools from 'hyperapp-redux-devtools'
import { getSearchResults, getFoodReport } from './api'
import { EventBus } from './EventBus'
import { initializeCharts } from './Charts'
import { chartActions } from './chartActions'
import { cloneDeep } from 'lodash'

const state = {
  initial: true,
  search: '',
  searchResults: null,
  selectedFoods: [],
  focusedFood: null,
  error: null,
  charts: {
    aminoAcidValues: {},
    showAminoAcidsChart: false
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

const actions = {
  reduce: fn => s => fn(s),
  setInitial: () => ({ initial: false }),
  setInput: value => ({ search: value }),
  getFoodSuggetions: value => async (state, actions) => {
    const { setSearchResults, setError } = actions
    const response = await getSearchResults(value)
    if (response.ok) {
      const body = await response.json()
      setSearchResults(body)
    } else {
      // setError(response)
      window.alert(JSON.stringify(response))
    }
  },
  selectFood: value => async (state, actions) => {
    const { addFood, setError } = actions
    const response = await getFoodReport(value)
    if (response.ok) {
      const body = await response.json()
      if (body && body.foods && body.foods.length) {
        if (body.foods.length > 1) {
          console.warn('API returned more than 1 food for ndbno ' + value)
        }
        addFood(parseFoodResponse(body.foods[0].food))
      }
    } else {
      // setError(response)
      window.alert(JSON.stringify(response))
    }
  },
  setSearchResults: searchResults => ({ searchResults }),
  addFood: value => (state, actions) => {
    const { reduce, updateChartData } = actions
    const { selectedFoods } = actions.reduce(s => ({ selectedFoods: [...s.selectedFoods, value] }))
    actions.charts.updateChartData(selectedFoods)
  },
  removeFood: value => (state, actions) => {
    const newSelectedFoods = state.selectedFoods.filter(food => food !== value)
    const { selectedFoods } = actions.reduce(s => ({ selectedFoods: newSelectedFoods }))
    actions.charts.updateChartData(selectedFoods)
  },
  setQuantity: ({ food, quantity }) => (state, actions) => {
    const newFood = cloneDeep(food)
    newFood.quantity = quantity
    const newSelectedFoods = state.selectedFoods.map(i => i == food ? newFood : i) // TODO FIX! way of uniquely identify items
    const { selectedFoods } = actions.reduce(s => ({ selectedFoods: newSelectedFoods }))
    actions.charts.updateChartData(selectedFoods)
  },
  charts: chartActions
}

const view = (state, actions) => {
  const { initial, search, searchResults, selectedFoods, charts: { showAminoAcidsChart } } = state
  const { getFoodSuggetions, selectFood, setInput, removeFood, setQuantity, setInitial, charts } = actions

  // find a better way of triggering initial chart draw
  if (initial) {
    // charts.updateChartData(selectedFoods)
    // setInitial()
  }

  const searchResultErrors = searchResults && searchResults.errors
  const hasSearchResults = searchResults && searchResults.list && searchResults.list && searchResults.list.item.length > 0

  return (
    <grid>
      <div col="1/2">
        <div class='panel'>
          <h2>Search:</h2>
          <label>Search query</label>
          <input id="searchInput"
            type="text"
            oninput={e => {
              setInput(e.target.value)
            }}
            onkeyup={e => {
              if (e.key === 'Enter') {
                getFoodSuggetions(search)
              }
            }}
          />
          <button onclick={() => getFoodSuggetions(search)}>Search</button>
        </div>
        <div class='panel'>
          <h2>Results:</h2>
          { searchResultErrors && <div>{searchResultErrors}</div>}
          <ul id="resultsList">
          { hasSearchResults
            && searchResults.list.item.map(i => <ResultItem result={i} selectFood={selectFood} />) }
          </ul>
        </div>
      </div>
      <div col="1/2">
        <div class='panel'>
          <h2>Selected:</h2>
          <ul id="foodsList">
            { selectedFoods.map(food => <FoodItem food={food} removeFood={removeFood} setQuantity={setQuantity} />) }
          </ul>
          <div id="macrosChart" />
          <div id="aminoAcidsChart" />
        </div>
      </div>
    </grid>
  )
}

const ResultItem = ({ result, selectFood }) => (
  <li class="resultItem" onclick={() => selectFood(result.ndbno) }>
    <div class="itemTitle">{result.name}</div>
    <tag>{result.group}</tag>
  </li>
)

const FoodItem = ({ food, removeFood, setQuantity }) => (
  <li class="foodItem">
    <div class="itemTitle">{food.desc.name}</div>
    <input class="qtyInput"
      placeholder="qty"
      value={food.quantity}
      oninput={e => {
        setQuantity({ food, quantity: e.target.value })
      }}
    />
    <select class="measuresDropdown">
      { food.measures && food.measures.map(measure => 
        <option>{measure.label} ({measure.eqv}{measure.eunit})</option>
      )}
    </select>
    <button onclick={() => removeFood(food)}>X</button>
  </li>
)


const { resetAminoAcids } = devtools(app)(state, actions, view, document.getElementById('app'))

initializeCharts({ resetAminoAcids })