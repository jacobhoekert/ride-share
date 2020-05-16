<template>
  <div class="dashboard-container">
    <div v-if="!$store.state.hasBackButton" class="top-text">
      <div class="left">
        <p class="report-title">{{$store.state.dashboardTitle}}</p>
      </div>
      <div> 
        <v-select 
          v-if="$store.state.currentAccountType == 'admin'" 
          class="select actions" @input="goToAction" 
          :options="['Show Upcoming Rides', 'Add/Update Ride', 'Add/Update Vehicle', 'Add Vehicle Type', 'Authorize Driver']" 
          placeholder="Select an Action"
          :clearable="false"
        ></v-select>
        <v-btn v-else v-on:click="goToJoinRidePage" class="button" text >
          <span class="btn-text">Join A Ride</span>
        </v-btn>
      </div>
    </div>
    <div v-else class="top-text-centered">
      <div> 
        <v-btn v-on:click="goBack" class="button" text>
          <span class="btn-text">Back</span>
        </v-btn>
      </div>
      <div>
        <p class="report-title-centered">{{$store.state.dashboardTitle}}</p>
      </div>
    </div>
    <div v-if="$store.state.dashboardTitle" class="page-wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
// import Report from './Report';

export default {
  components: {
    vSelect,
    // Report
  },
  computed: {
    hello() {
      return <h1> hello</h1>
    }
  },
  data() {
    return {
      dashboardTitle: "Upcoming Rides"
    }
  },
  beforeMount() {
    if (this.$store.state.currentAccountType != 'admin') {
      this.$store.commit('setDashboardTitle', 'Your Upcoming Rides');
      this.$store.commit('setPreviousTitle', 'Your Upcoming Rides');
      this.$router.push({ path: "/account/report" });
      this.$store.commit('setHasBackButton', false);
    } else {
      this.$store.commit('setDashboardTitle', 'All Upcoming Rides');
      this.$store.commit('setPreviousTitle', 'All Upcoming Rides');
      this.$store.commit('setHasBackButton', false);
    }
  },
  mounted() {
    this.$store.watch(() => this.$store.getters.getCurrentAccountId,
      () => {
        if (this.$store.state.currentAccountType != 'admin') {
          this.$store.commit('setDashboardTitle', 'Your Upcoming Rides');
          this.$store.commit('setPreviousTitle', 'Your Upcoming Rides');
          this.$store.commit('setHasBackButton', false);
        } else {
          this.$store.commit('setDashboardTitle', 'All Upcoming Rides');
          this.$store.commit('setPreviousTitle', 'All Upcoming Rides');
          this.$store.commit('setHasBackButton', false);
        }
      }
    )
  },
  methods: {
    goBack() {
      if (this.$store.state.dashboardTitle == 'Join a Ride') {
        this.$router.push({ path: "/account/report" });
      }
      this.$store.commit('setHasBackButton', false);
      this.$store.commit('setDashboardTitle', this.$store.state.previousTitle);
    },
    goToJoinRidePage() {
      this.$router.push({ path: "/account/join-ride" });
      this.$store.commit('setHasBackButton', true);
      this.$store.commit('setDashboardTitle', 'Join a Ride');
    },
    goToAction(action) {
      switch (action) {
        case "Show Upcoming Rides":
          this.$store.commit('setDashboardTitle', 'All Upcoming Rides');
          this.$store.commit('setPreviousTitle', 'All Upcoming Rides');
          this.$router.push({ path: "/account/report" });
          this.$store.commit('setHasBackButton', false);
          break;
        case "Add/Update Vehicle":
          this.$store.commit('setDashboardTitle', 'Add/Update Vehicle');
          this.$store.commit('setPreviousTitle', 'Add/Update Vehicle');
          this.$router.push({ path: "/account/vehicle" });
          this.$store.commit('setHasBackButton', false);
          break;
        case "Add Vehicle Type":
          this.$store.commit('setDashboardTitle', 'Add Vehicle Type');
          this.$store.commit('setPreviousTitle', 'Add Vehicle Type');
          this.$router.push({ path: "/account/vehicle-type" });
          this.$store.commit('setHasBackButton', false);
          break;
        case "Add/Update Ride":
          this.$store.commit('setDashboardTitle', 'Add/Update Rides');
          this.$store.commit('setPreviousTitle', 'Add/Update Rides');
          this.$router.push({ path: "/account/ride" });
          this.$store.commit('setHasBackButton', false);
          break;
        case "Authorize Driver":
          this.$store.commit('setDashboardTitle', 'Authorized Drivers');
          this.$store.commit('setPreviousTitle', 'Authorized Drivers');
          this.$router.push({ path: "/account/driver" });
          this.$store.commit('setHasBackButton', false);
          break;
        default:
          this.$router.push({ path: "/account/report" });
          this.$store.commit('setHasBackButton', false);
      }
    },
  }
}
</script>

<style scoped>
  .dashboard-container {
    width: 50%;
    margin: auto;
    margin-top: 150px;
    margin-bottom: 150px;
  }
  .top-text {
    display: flex;
    font-family: 'Abel', sans-serif;
    justify-content: space-between;
  }
  .top-text-centered {
    display: flex;
    font-family: 'Abel', sans-serif;
  }
  .report-title {
    font-size: 25px;
    margin-top: 5px;
    margin-left: 10px;
    margin-bottom: 0px;
  }
  .report-title-centered {
    font-size: 25px;
    margin-top: 5px;
    margin-left: 60px;
    margin-bottom: 0px;
  }
  .select {
    width: 175px;
    font-size: 20px;
    font-family: 'Abel', sans-serif;
  }
  .reports {
    margin-left: 10px;
  }
  .actions {
    width: 240px;
  }
  .vs__dropdown-menu li {
    background: black;
  }
  .button {
    display: block;
    color: white;
    background: rgb(89, 89, 212);
    width: 150px;
    font-size: 18px;
    margin: auto;
    font-family: 'Abel', sans-serif;
    margin-right: 10px;
  }
  .btn-text {
    padding: 5px;
  }
  .page-wrapper {
    padding-top: 10px;
    margin-top: 5px;
    height: auto;
    border-radius: 5px;
    background: rgb(240, 240, 240);
    box-shadow: 2px 8px 11px 0px rgb(199, 199, 199);
  }
  
</style>
