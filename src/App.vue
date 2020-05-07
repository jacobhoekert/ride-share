<template>
  <div id="app">
    <nav-bar />
    <router-view></router-view>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";

export default {
  name: "App",
  components: {
    NavBar
  },
  beforeMount() {
    this.$axios
      .get("/accounts")
      .then(result => {
        this.$store.commit('setAllAccounts', result.data);
        let accountNames = [];
        for (let account of result.data) {
          accountNames.push(account.firstName);
        }
        this.$store.commit('setAccountNames', accountNames);
      }); 
  },
};
</script>

