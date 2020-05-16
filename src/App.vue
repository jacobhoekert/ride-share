<template>
  <div id="app">
    <v-app>
      <nav-bar />
      <router-view></router-view>
    </v-app>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";

export default {
  name: "App",
  components: {
    NavBar
  },
};
</script>

