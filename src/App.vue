<template>
  <div id="app">
    <sidebar />
    <snippet-list />
    <snippet-container />
  </div>
</template>

<style>
html {
  margin-top: 32px; 
}
html, body {
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #25282c;
}
#app {
  top: 24px;
  width: 100%;
  height: 100%;
  position: fixed;
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
  import SnippetContainer from './components/SnippetContainer/SnippetContainer.vue';

  export default {
    name: 'App',
    components: {
      Sidebar,
      SnippetList,
      SnippetContainer
    }
  };
</script>