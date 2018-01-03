<template>
  <div id="app">
    <h1>Компонент дерева</h1>
    <dropdown></dropdown>
  </div>
</template>

<script>
import Dropdown from "./components/dropdown";

export default {
  components: { Dropdown },
  name: 'app'
}
</script>

<style lang="scss">
  #app {
    max-width: 1200px;
    margin: 0 auto;
  }
</style>
