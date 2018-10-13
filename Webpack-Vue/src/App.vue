<template>
  <div id="app">
    <tab/>
  </div>
</template>

<script>
import tab from './components/tab';
export default {
  name: 'App',
  components: {
    tab
  }
}
</script>

<style scoped lang="stylus">
  div > h1
    color antiquewhite
</style>
