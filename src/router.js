import Vue from "vue";
import Router from "vue-router";

import SignUp from "./pages/SignUp.vue";
import Admin from "./pages/Admin.vue";
import Driver from "./pages/Driver.vue";
import Passenger from "./pages/Passenger.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { name: "sign-up", path: "/sign-up", component: SignUp },
    { name: "admin-page", path: "/admin", component: Admin },
    { name: "driver-page", path: "/driver", component: Driver },
    { name: "passenger-page", path: "/passenger", component: Passenger },
  ]
});
