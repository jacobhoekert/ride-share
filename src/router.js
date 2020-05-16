import Vue from "vue";
import Router from "vue-router";

import Home from "./pages/Home.vue";
import SignUp from "./pages/SignUp.vue";
import Dashboard from "./components/Dashboard.vue";

import Report from "./components/Report.vue";
import AdminVehicle from "./components/AdminVehicle.vue";
import AdminVehicleType from "./components/AdminVehicleType.vue";
import AdminRide from "./components/AdminRide.vue";
import AdminDriver from "./components/AdminDriver.vue";
import JoinRide from "./components/JoinRide.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { name: "home", path: "/", component: Home },
    { name: "signUp", path: "/sign-up", component: SignUp },
    { name: "account", path: "/account", component: Dashboard,
      children: [
        {
          path: 'report',
          component: Report
        },
        {
          path: 'vehicle',
          component: AdminVehicle
        },
        {
          path: 'vehicle/add',
          component: AdminRide
        },
        {
          path: 'vehicle-type',
          component: AdminVehicleType
        },
        {
          path: 'ride',
          component: AdminRide
        },
        {
          path: 'driver',
          component: AdminDriver
        },
        {
          path: 'ride/add',
          component: AdminRide
        },
        {
          path: 'join-ride',
          component: JoinRide
        }
      ] 
    },
  ]
});
