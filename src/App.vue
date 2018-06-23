<template>
  <div id="app">
    <sidebar />
    <snippet-list />
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#app {
  width: 100%;
  height: 100%;
  color: #2c3e50;
  text-align: center;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<script>
  import Sidebar from './components/Sidebar/Sidebar.vue';
  import SnippetList from './components/SnippetList/SnippetList.vue';

  export default {
    name: 'App',
    components: {
      Sidebar,
      SnippetList
    }
  };
</script>