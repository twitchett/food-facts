<template>
  <ul id="foodsList">
    <li class="foodItem" v-for="(food, idx) in foodItems" :key="food.ndbno">
      <div class="itemTitle">{{ food.desc.name }}</div>
      <input class="qtyInput" placeholder="qty" />
      <select class="measuresDropdown" @change="measureChanged($event, idx)">
        <option v-for="measure in food.measures" :key="measure.label">
          <span>{{ measure.label }} ({{ measure.eqv }}{{ measure.eunit }})</span>
        </option>
      </select>
      <button @click="removeFood">X</button>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'FoodsList',
  props: {
    // desc: {
    //   validator: val => val.name && val.ndbno
    // },
    // measures: Array,
    // nutrients: Array,
    // quantity: Number,
    // selectedMeasure: Object
  },
  computed: {
    foodItems () {
      return this.$store.state.selectedFoods
    }
  },
  methods: {
    removeFood (food) {
      return this.$store.dispatch('removeFood', food)
    },
    measureChanged (ev, foodIdx) {
      const optionIdx = ev.target.selectedIndex
      const food = this.foodItems[foodIdx]
      const measure = food.measures[optionIdx]
      this.$store.dispatch('updateFoodMeasure', { food, measure })
    }
  }
}
</script>

<style>
.foodItem {
  padding: 4px;
  cursor: pointer;
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
</style>
