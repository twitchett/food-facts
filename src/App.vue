<template>
  <grid>
    <div col="1/2">
      <div class='panel'>
        <h2>Search:</h2>
        <label>Search query</label>
        <input id="searchInput"
          type="text"
          v-model="searchText"
          v-on:keyup.enter="submit"
        />
        <button @click="submit">Search</button>
      </div>
      <div class='panel'>
        <h2>Results:</h2>
        <div v-if="searchResultsError">{{ searchResultsError }}</div>
        <SearchResultList />
      </div>
    </div>
    <div col="1/2">
      <div class='panel'>
        <h2>Selected:</h2>
        <FoodsList />
        <div id="macrosChart" />
        <div id="aminoAcidsChart" />
      </div>
    </div>
  </grid>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import FoodsList from './components/FoodsList'
import SearchResultList from './components/SearchResultList'
import { drawCharts } from './charts/charts'

export default {
  name: 'App',
  components: {
    FoodsList,
    SearchResultList
  },
  data () {
    return {
      searchText: ''
    }
  },
  created () {
    this.$store.subscribe((mutation, state) => {
      const updateDataTriggers = ['updateSelectedFoods', 'addFood']

      if (updateDataTriggers.includes(mutation.type)) {
        this.$store.dispatch('updateChartData', state.selectedFoods)
      }

      if (mutation.type === 'setChartData') {
        drawCharts(state.charts)
      }
    })
  },
  computed: {
    ...mapGetters([
      'hasSearchResults'
    ]),
    searchResultsError () {
      return this.$store.state.searchResultsError
    }
  },
  methods: {
    ...mapActions([
      'getFoodSuggestions'
    ]),
    submit () {
      this.getFoodSuggestions(this.searchText)
    }
  }
}
</script>

<style>
/* Overrides */
button,
select,
ul {
  margin: 0;
}
li {
  list-style-type: none
}

/* General Styles */

.panel {
  padding: 10px 10px 20px 10px;
}

#searchInput {
  width: 80%;
  margin-right: 10px;
}

#foodsList,
#resultsList {
  margin-left: 0;
  padding-left: 0;
}

/* Charts */

#macrosChart {
  width: 90%;
}

</style>
