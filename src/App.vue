<template>
  <div id="app">
    <main-header></main-header>
    <transition>
      <router-view/>
    </transition>
  </div>
</template>

<script>
// eslint-disable-next-line
import MainHeader from "@/components/MainHeader";

export default {
  name: 'App',
  components: {
    'main-header': MainHeader
  }
}
</script>

<style>
#app {
  /* font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
}
</style>
