import { h, app } from 'hyperapp'
import devtools from 'hyperapp-redux-devtools'
import { getSearchResults, getFoodReport } from './api'
import { EventBus } from './EventBus'
import { Charts } from './Charts'

const c = new Charts()

const state = {
  search: '',
  searchResults: null,
  selectedFoods: [],
  focusedFood: null,
  error: null
}

const parseFoodResponse = food => {
  console.log('parsing food', food)
  if (food.nutrients && food.nutrients.length > 0) {
    food.measures = Object.values(food.nutrients[0].measures)
    console.log('food.measures', food.measures)
  } else {
    console.warn('No measures for food', food)
  }
  console.log('parsed food', food)
  return food
}

const actions = {
  reduce: fn => s => fn(s),
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
    const { selectedFoods } = actions.reduce(s => ({ selectedFoods: [...s.selectedFoods, value] }))
    EventBus.emit('foods_updated', selectedFoods)
  },
  removeFood: value => (state, actions) => {
    const newSelectedFoods = state.selectedFoods.filter(food => food !== value)
    const { selectedFoods } = actions.reduce(s => ({ selectedFoods: newSelectedFoods }))
    EventBus.emit('foods_updated', selectedFoods)
  }
}

const view = (state, actions) => {
  const { search, searchResults, selectedFoods } = state
  const { getFoodSuggetions, selectFood, setInput, removeFood } = actions
  EventBus.emit('foods_updated', selectedFoods)

  const searchResultErrors = searchResults && searchResults.errors
  const hasSearchResults = searchResults && searchResults.list && searchResults.list && searchResults.list.item.length > 0

  return (
    <grid>
      <div col="1/2">
        <div class='panel'>
          <h2>Search:</h2>
          <label>Search query</label>
          <input class="searchInput"
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
          <ul class="resultsList">
          { hasSearchResults
            && searchResults.list
            && searchResults.list.item.map(i => renderResultItem(i, selectFood)) }
          </ul>
        </div>
      </div>
      <div col="1/2">
        <div class='panel'>
          <h2>Selected:</h2>
          <ul id="foodsList">
            { selectedFoods.map(food => renderFoodItem(food, removeFood)) }
          </ul>
          <div id="macrosChart" />
          <div id="aminoAcidsChart">No Amino Acids to show</div>
        </div>
      </div>
    </grid>
  )
}

const renderResultItem = (result, selectFood) => (
  <li class="resultItem" onclick={() => selectFood(result.ndbno) }>
    <div class="itemTitle">{result.name}</div>
    <tag>{result.group}</tag>
  </li>
)

const renderFoodItem = (food, removeFood) => (
  <li class="foodItem">
    <div class="itemTitle">{food.desc.name}</div>
    <input class="qtyInput" placeholder="qty" />
    <select class="measuresDropdown">
      { food.measures && food.measures.map(measure => 
        <option>{measure.label} ({measure.eqv}{measure.eunit})</option>
      )}
    </select>
    <button onclick={() => removeFood(food)}>X</button>
  </li>
)


devtools(app)(state, actions, view, document.getElementById('app'))