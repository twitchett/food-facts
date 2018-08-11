import { h, app } from 'hyperapp'
import devtools from 'hyperapp-redux-devtools'
import axios from 'axios'

const HOST = 'https://api.nal.usda.gov/ndb'
const SEARCH = `${HOST}/search`
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
  foodSuggestions: [],
  selectedFoods: [],
  focusedFood: null,
  error: null
}

const actions = {
  setInput: value => state => ({ q: value }),
  getFoodSuggetions: value => async (state, actions) => {
    const { q } = state
    const { addFood, setError } = actions
    const paramString = params
      .map(([key, value]) =>
        `${key}=${value}`
      )
      .join('&')
    const url = `${SEARCH}?${paramString}&q=${q}`
    console.log('making request')
    const response = await fetch(url, requestOpts)
    console.log('response', response)
    if (response.ok) {
      const body = await response.json()
      actions.addSelectedFood(body)
    } else {
      setError(response)
    }
  },
  addSelectedFood: value => state => ({ selectedFoods: [...state.selectedFoods, value] }),
  setError: error => state => ({ error }),
  down: value => state => ({ count: state.count - value }),
  up: value => state => ({ count: state.count + value })
}

const view = (state, actions) => {
  const { q, selectedFoods } = state

  return (
    <grid>
      <div col="1/2">
        <div>
          <h2>Choose</h2>
          <input
            type="text"
            oninput={e => {
              console.log('newvalue', e.target.value)
              actions.setInput(e.target.value)
            }}
            onupdate={(element, prevAttrs) => {
              console.log('onupdate el', element)
              console.log('onupdate prevAttrs', prevAttrs)
            }}
          />
          <button onclick={() => actions.getFoodSuggetions(q)}>Search</button>
          <button onclick={() => actions.down(1)}>-</button>
          <button onclick={() => actions.up(1)}>+</button>
        </div>
      </div>
      <div col="1/2">
        <h2>Selected:</h2>
        <ul>
          {selectedFoods.map(food => <li>{food}</li>)}
        </ul>
      </div>
  </grid>
  )
}

devtools(app)(state, actions, view, document.getElementById('app'))

// if (process.env.NODE_ENV !== 'production') {
//   import('hyperapp-redux-devtools')
//     .then((devtools) => {
//       devtools(app)(state, actions, view, document.getElementById('app'))
//     });
// } else {
//   main = devtools(app)(state, actions, view, document.getElementById('app'))
// }

// import { h, app } from 'hyperapp';

// const actions = {
//   add: (/* event (e) */) => ({ num }) => ({ num: num + 1 }),
//   sub: (/* event (e) */) => ({ num }) => ({ num: num - 1 }),
//   setInput: value => state => ({ q: value }),
//   getFoodSuggetions: value => async (state, actions) => {
//     const { q } = state
//     const { addFood, setError } = actions
//     const paramString = params
//       .map(([key, value]) =>
//         `${key}=${value}`
//       )
//       .join('&')
//     const url = `${SEARCH}?${paramString}&q=${q}`
//     console.log('making request')
//     const response = await fetch(url, requestOpts)
//     console.log('response', response)
//     if (response.ok) {
//       const body = await response.json()
//       actions.addFood(body)
//     } else {
//       setError(response)
//     }
//   },
//   addFood: value => state => ({ selectedFoods: [...state.selectedFoods, value] }),
//   setError: error => state => ({ error }),
//   down: value => state => ({ count: state.count - value }),
//   up: value => state => ({ count: state.count + value })
// };

// const state = {
//   num: 0,
//   q: '',
//   foodSuggestions: [],
//   selectedFoods: [],
//   focusedFood: null,
//   error: null,
// };
// const view = (state, actions) => {
//   const { num } = state
//   const { add, sub } = actions

//   return (
//     <div class="counter">
//   <h1>{state.count}</h1>
//     <input
//       type="text"
//       oninput={e => {
//         console.log('newvalue', e.target.value)
//         actions.setInput(e.target.value)
//       }}
//       onupdate={(element, prevAttrs) => {
//         console.log('onupdate el', element)
//         console.log('onupdate prevAttrs', prevAttrs)
//       }}
//     />
//       <button onclick={() => actions.getFoodSuggetions(q)}>Search</button>
//       <button onclick={() => actions.down(1)}>-</button>
//       <button onclick={() => actions.up(1)}>+</button>
//       <section>
//         <button
//           class="sub"
//           onclick={sub}
//           disabled={num < 1}
//         >
//           -
//         </button>
//         <h1 class="count">{num}</h1>
//         <button
//           class="add"
//           onclick={add}
//         >
//           +
//         </button>
//       </section>
//     </div>
//   )
// }


// const appArgs = [
//   state,
//   actions,
//   view,
//   document.getElementById('app'),
// ];

// let main;

// if (process.env.NODE_ENV !== 'production') {
//   import('hyperapp-redux-devtools')
//     .then((devtools) => {
//       main = devtools(app)(...appArgs);
//     });
// } else {
//   main = app(...appArgs);
// }
