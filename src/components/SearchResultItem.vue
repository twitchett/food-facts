<template>
  <div class="resultItem"> <!-- onClick: select food -->
    <div class="itemTitle">{{ name }}</div>
    <tag>{{ group }}</tag>
  </div>
</template>

<script>
export default {
  name: 'SearchResultItem',
  props: {
    name: 'String',
    group: 'String'
  }
}
</script>
