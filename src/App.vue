<template>
  <div id="app">
    <h1>This is not an IDE!</h1>
    <sidebar />
  </div>
</template>

<style>
html {
  background-color: #FCFCFC;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<script>
  import Sidebar from './components/Sidebar/Sidebar.vue';


export default {
  name: 'App',
  components: {
    Sidebar
  }
};
</script>