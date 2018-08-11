import { h, app } from 'hyperapp'
import devtools from 'hyperapp-redux-devtools'
import axios from 'axios'

const HOST = 'https://api.nal.usda.gov/ndb'
const SEARCH = `${HOST}/search`
const REPORT = `${HOST}/V2/reports`
const API_KEY = 'fTS7p8sGvtY5i9HtukkiZQw2iAA49elj8yrXb3SG'

const params = [
  [ 'api_key', 'fTS7p8sGvtY5i9HtukkiZQw2iAA49elj8yrXb3SG' ],
  [ 'sort', 'r' ],
  [ 'ds', 'Standard Reference'],
  [ 'format', 'json' ]
]

const requestOpts = {
  mode: 'cors'
}

const state = {
  q: '',
  searchResults: {
    list: {
      item: []
    }
  },
  selectedFoods: [],
  focusedFood: null,
  error: null
}

const actions = {
  setInput: value => state => ({ q: value }),
  getFoodSuggetions: value => async (state, actions) => {
    const { q } = state
    const { setSearchResults, setError } = actions
    const paramString = params
      .map(([key, value]) =>
        `${key}=${value}`
      )
      .join('&')
    const url = `${SEARCH}?${paramString}&q=${q}`
    const response = await fetch(url, requestOpts)
    if (response.ok) {
      const body = await response.json()
      setSearchResults(body)
    } else {
      setError(response)
    }
  },
  selectFood: value => async (state, actions) => {
    const { addFood, setError } = actions
    const url = `${REPORT}?api_key=fTS7p8sGvtY5i9HtukkiZQw2iAA49elj8yrXb3SG&ndbno=${value}`
    const response = await fetch(url, requestOpts)
    if (response.ok) {
      const body = await response.json()
      if (body && body.foods && body.foods.length) {
        addFood(body.foods[0].food)
      }
    } else {
      setError(response)
    }
  },
  setSearchResults: searchResults => state => ({ searchResults }),
  addFood: value => state => ({ selectedFoods: [...state.selectedFoods, value] }),
  setError: error => state => ({ error }),
  down: value => state => ({ count: state.count - value }),
  up: value => state => ({ count: state.count + value })
}

const view = (state, actions) => {
  const { q, searchResults, selectedFoods } = state
  const { getFoodSuggetions, selectFood } = actions

  return (
    <grid>
      <div col="1/2">
        <div class='panel'>
          <h2>Search:</h2>
          <input class="searchInput"
            type="text"
            oninput={e => {
              console.log('newvalue', e.target.value)
              actions.setInput(e.target.value)
            }}
            onkeyup={e => {
              if (e.key === 'Enter') {
                getFoodSuggetions(q)
              }
            }}
            onupdate={(element, prevAttrs) => {
              console.log('onupdate el', element)
              console.log('onupdate prevAttrs', prevAttrs)
            }}
          />
          <button onclick={() => getFoodSuggetions(q)}>Search</button>
        </div>
        <div class='panel'>
          <h2>Results:</h2>
          <ul class="resultsList">
          { searchResults.list.item.map(i => <li onclick={() => selectFood(i.ndbno)}>{i.name} [{i.group}]</li>) }
          </ul>
        </div>
      </div>
      <div col="1/2">
        <div class='panel'>
          <h2>Selected:</h2>
          <ul>
            { selectedFoods.map(food => <li>{food.desc.name}</li>) }
          </ul>
        </div>
      </div>
  </grid>
  )
}

devtools(app)(state, actions, view, document.getElementById('app'))
