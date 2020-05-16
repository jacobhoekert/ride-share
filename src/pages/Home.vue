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
    <v-btn v-on:click="goToSignUpPage" class="button" text>
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
  beforeMount() {
    this.$store.commit('setCurrentAccountName', null);
    this.$store.commit('setCurrentAccountType', null);
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
}
</script>

<style scoped>
  .home-container {
    width: 30%;
    margin: auto;
    margin-top: 200px;
  }
  .title {
    font-size: 50px !important;
    color: rgb(62, 62, 163);
    font-family: 'Abel', sans-serif !important;
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
