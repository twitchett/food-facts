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
        addFood(body.foods[0].food)
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

  return (
    <grid>
      <div col="1/2">
        <div class='panel'>
          <h2>Search:</h2>
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
          <ul class="resultsList">
          { searchResults && searchResults.list.item.map(i => renderResultItem(i, selectFood)) }
          </ul>
        </div>
      </div>
      <div col="1/2">
        <div class='panel'>
          <h2>Selected:</h2>
          <ul class="foodsList">
            { selectedFoods.map(food => renderFoodItem(food, removeFood)) }
          </ul>
          <div id="macrosChart" />
        </div>
      </div>
    </grid>
  )
}

const renderResultItem = (result, selectFood) => (
  <li class="resultItem" onclick={() => selectFood(result.ndbno) }>
    <div>{result.name}</div> <tag>{result.group}</tag>
  </li>
)

const renderFoodItem = (food, removeFood) => (
  <li class="foodItem">
    <div>{food.desc.name}</div>
    <button onclick={() => removeFood(food)}>X</button>
  </li>
)

devtools(app)(state, actions, view, document.getElementById('app'))