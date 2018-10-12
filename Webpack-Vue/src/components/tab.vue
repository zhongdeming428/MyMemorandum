<style scoped>
  .tab {
    width: 5rem;
    height: 1.5rem;
    background-color: cornflowerblue;
    position: relative;
  }
  .tab::before {
    content: "";
    height: 0;
    width: 0;
    border: 0.75rem solid cornflowerblue;
    border-top-color: transparent;
    border-left-color: transparent;
    position: absolute;
    left: -1.5rem;
    bottom: 0;
  }
  .tab::after {
    content: "";
    height: 0;
    width: 0;
    border: 0.75rem solid cornflowerblue;
    border-top-color: transparent;
    border-right-color: transparent;
    position: absolute;
    left: 100%;
    bottom: 0;
  }
  @media (min-resolution: 2dppx) {
    .tab {
      background-color: aliceblue
    }
  }
</style>

<template>
  <div class="tab">

  </div>
</template>

<script>
export default {
  name: 'tab'
}
</script>
