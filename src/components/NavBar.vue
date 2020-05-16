<template>
  <v-app-bar app>
    <div class="nav">
      <router-link v-bind:to="{ name: 'home' }">
        <v-toolbar-title class="logo">
          Vroom Vroom
        </v-toolbar-title>
      </router-link>
      <div class="right">
        <v-select 
          v-if="$store.state.currentAccountName" 
          class="select" @input="setCurrentAccount" 
          :options="$store.state.accountNames" 
          :value="$store.state.currentAccountName" 
          :clearable="false"
        ></v-select>
        <v-btn v-on:click="goToSignUpPage" class="button" text >
          <span class="btn-text">Sign Up</span>
        </v-btn>
      </div>
    </div>
  </v-app-bar>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

export default {
  components: {
    vSelect,
  },
  methods: {
    setCurrentAccount(user) {
      for (let account of this.$store.state.allAccounts) {
        if (account.firstName == user) {
          this.$store.commit('setCurrentAccountName', user);
          this.$store.commit('setCurrentAccountType', account.userType);
          this.$store.commit('setCurrentAccountId', account.id);
          this.$router.push({ path: "/account/report" });
        }
      }
    },
    goToSignUpPage() {
      this.$router.push({ path: "/sign-up" });
    }
  }
};
</script>

<style scoped>
  .nav {
    width: 80%;
    margin: auto;
    display: flex;
    justify-content: space-between;
  }
  a {
    text-decoration: none;
  }
  .logo {
    font-size: 25px;
    color: rgb(62, 62, 163);
    font-family: 'Abel', sans-serif;
    margin: 0px;
  }
  .right {
    display: flex;
  }
  .select {
    width: 200px;
    font-size: 18px;
    margin-right: 10px;
    font-family: 'Abel', sans-serif;
  }
  .button {
    height: 50px;
    color: white;
    background: rgb(89, 89, 212);
    width: 150px;
    font-size: 22px;
    margin: 0px;
    font-family: 'Abel', sans-serif;
  }
</style>