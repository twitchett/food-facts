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
        <ul v-if="hasSearchResults" id="resultsList">
          <li v-for="result in searchResults" :key="result.ndbno">
            <!-- <ResultItem v-bind="result" /> -->
            <div>{{ result }}</div>
          </li>
        </ul>
      </div>
    </div>
    <div col="1/2">
      <div class='panel'>
        <h2>Selected:</h2>
        <ul id="foodsList">
          <li v-for="food in foodItems" :key="food.ndbno">
            <!-- <FoodSearchResul v-bind="food" /> -->
            <div>{{ food.name }}</div>
          </li>
        </ul>
        <div id="macrosChart" />
        <div id="aminoAcidsChart" />
      </div>
    </div>
  </grid>
</template>

<script>
// import HelloWorld from './components/HelloWorld'
import { mapActions, mapGetters } from 'vuex'
import FoodItem from './components/FoodItem'
import SearchResultItem from './components/SearchResultItem'

export default {
  name: 'App',
  components: {
    FoodItem,
    SearchResultItem
  },
  data: function () {
    return {
      searchText: ''
    }
  },
  computed: {
    ...mapGetters([
      'hasSearchResults'
    ]),
    searchResults () {
      return this.$store.state.searchResults
    },
    searchResultsError () {
      return this.$store.state.searchResultsError
    },
    foodItems () {
      return this.$store.state.selectedFoods
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

/* Results List */

.resultItem {
  padding: 4px;
  cursor: pointer;
  list-style-type: none;
  display: flex;
  align-items: center;
}

.itemTitle {
  flex-grow: 2;
  margin-right: 5px;
}

.resultItem:nth-child(even) {
  background: #f9fbfb
}

.resultItem:hover {
  background: #dbe1e7
}

/*.resultItem > div {
  display: inline-block;
}
*/
/* Selected Foods */

.foodItem {
  padding: 4px;
  cursor: pointer;
  list-style-type: none;
  display: flex;
  align-items: center;
}

.foodItem .itemTitle {
  height: 30px;
  padding-right: 15px;
  display: inline-block;
  width: 70%;
}

.measuresDropdown {
  width: 200px;
  display: inline-block;
  margin-right: 5px;
}

#foodsList .qtyInput {
  margin: 0 5px 0;
  width: 4rem;
  height: 4rem;
  padding: 1rem;
  border: 1px solid hsl(200, 10%, 90%);
}

#foodsList .qtyInput:focus {
  border-color: #679;
}

/* Charts */

#macrosChart {
  width: 90%;
}

</style>
