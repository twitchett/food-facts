<template>
  <ul id="resultsList">
    <li class="resultItem"
      v-for="result in searchResultsList"
      :key="result.ndbno"
      @click="selectFood(result)">
        <div class="itemTitle">{{ result.name }}</div>
        <tag>{{ result.group }}</tag>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'SearchResultsList',
  computed: {
    searchResultsList () {
      return this.$store.state.searchResults.list
    }
  },
  methods: {
    selectFood (food) {
      this.$store.dispatch('selectFood', food.ndbno)
    }
  }
}
</script>

<style>
  .resultItem {
    padding: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .resultItem:nth-child(even) {
    background: #f9fbfb
  }

  .resultItem:hover {
    background: #dbe1e7
  }

  .itemTitle {
    flex-grow: 2;
    margin-right: 5px;
  }
</style>
