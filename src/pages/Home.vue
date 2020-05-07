<template>
  <div class="home-container">
    <h1 class="title">Vroom Vroom</h1>
    <p>Select an account to begin</p>
    <v-select 
      v-if="$store.state.accountNames" 
      class="select" @input="setCurrentAccount" 
      :options="$store.state.accountNames" 
      :value="$store.state.currentAccountName" 
      :clearable="false"
    ></v-select>
    <p>Or create a new account</p>
    <v-btn class="button" text v-bind:to="{ name: 'sign-up' }">
      <span class="btn-text">Sign Up</span>
    </v-btn>
  </div>
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
          this.changeUserPage();
        }
      }
    },
    changeUserPage() {
      switch (this.$store.state.currentAccountType) {
        case "admin":
          this.$router.push({ name: "admin-page" });
          break;
        case "driver":
          this.$router.push({ name: "driver-page" });
          break;
        case "passenger":
          this.$router.push({ name: "passenger-page" });
          break;
        default:
          this.$router.push({ name: "admin-page" });
      }
    }
  }
}
</script>

<style scoped>
  .home-container {
    width: 30%;
    margin: auto;
    margin-top: 200px;
  }
  .title {
    font-size: 50px;
    color: rgb(62, 62, 163);
    font-family: 'Abel', sans-serif;
    text-align: center;
    margin-bottom: 40px;
  }
  p {
    text-align: center;
    font-family: 'Abel', sans-serif;
    margin-bottom: 15px;
    font-size: 18px;
  }
  .select {
    width: 200px;
    margin: auto;
    font-size: 18px;
    font-family: 'Abel', sans-serif;
    margin-bottom: 30px;
  }
  .button {
    display: block;
    color: white;
    background: rgb(89, 89, 212);
    width: 150px;
    font-size: 22px;
    margin: auto;
    font-family: 'Abel', sans-serif;
  }
  .btn-text {
    padding: 3px;
  }
</style>
