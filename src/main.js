import Vue from "vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import App from "./App.vue";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000"
});
Vue.prototype.$axios = axiosClient;

new Vue({
  el: "#app",
  data: {
    currentUser: null
  },
  router,
  store,
  render: h => h(App)
});
