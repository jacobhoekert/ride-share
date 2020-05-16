<template>
  <div>
    <div v-if="$store.state.hasBackButton && isAllDetailsPage" class="all-details-container">
      <div class="detail">
        <p>From Location:</p>
        <p>{{rideShowingDetails.fromLocation}}</p>
      </div>
      <div class="detail">
        <p>To Location:</p>
        <p>{{rideShowingDetails.toLocation}}</p>
      </div>
      <div class="detail">
        <p>Distance:</p>
        <p>{{rideShowingDetails.distance}}</p>
      </div>
      <div class="detail">
        <p>Date:</p>
        <p>{{rideShowingDetails.date}}</p>
      </div>
      <div class="detail">
        <p>Time:</p>
        <p>{{rideShowingDetails.time}}</p>
      </div>
      <div class="detail">
        <p>Vehicle:</p>
        <p>{{rideShowingDetails.vehicle}}</p>
      </div>
      <div class="detail">
        <p>License Plate:</p>
        <p>{{rideShowingDetails.licensePlate}}</p>
      </div>
      <div class="detail">
        <p>Capacity</p>
        <p>{{rideShowingDetails.capacity}}</p>
      </div>
      <div class="detail">
        <p>Drivers</p>
      </div>
        <div v-for="driver in rideShowingDetails.drivers" :key="driver.id" class="person-details">
          <p>Name: {{driver.firstName}} {{driver.lastName}}<p>
          <p>Phone: {{driver.phone}}</p>
        </div>
      <div class="detail">
        <p>Passengers</p>
      </div>
        <div v-for="passenger in rideShowingDetails.passengers" :key="passenger.id" class="person-details">
          <p>Name: {{passenger.firstName}} {{passenger.lastName}}<p>
          <p>Phone: {{passenger.phone}}</p>
        </div>
    </div>
    <div v-else class="report-container">
      <div v-if="!isLoading && rides.length == 0">
        <p>There are no rides to join.</p>
      </div>
      <div v-if="isLoading">
        <p>Loading...</p>
      </div>
      <div v-for="ride in rides" :key="ride.id" class="ride">
        <div class="ride-card">
          <div class="left-text">
            <div>
              <span class="location">{{ride.fromLocation}}</span>
              <span class="material-icons arrow">arrow_right_alt</span>
              <span class="location">{{ride.toLocation}}</span>
            </div>
            <div class="distanceAndCapacity">
              <span class="distance">{{ride.distance}}</span>
              <span class="capacity">Rem. Capacity: {{ride.capacity}}</span>
            </div>
          </div>
          <div class="right-text">
            <span class="time">{{ride.time}}</span>
            <span class="date">{{ride.date}}</span>
          </div>
        </div>
        <div v-on:click="setAllDetailsPage(ride.id)" class="details-button">
          <p class="see-details">See All Details</p>
        </div>
        <div v-on:click="joinRide(ride.id)" class="join-button">
          <p class="see-details">Join</p>
        </div>
      </div>
      <div class="text-xs-center">
        <v-dialog v-model="dialogVisible" width="500">
          <v-card>
            <v-card-title primary-title>
              {{ dialogHeader }}
            </v-card-title>

            <v-card-text>
              {{ dialogText }}
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text v-on:click="hideDialog">Okay</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rides: [],
      isAllDetailsPage: false,
      rideShowingDetails: null,
      isLoading: false,

      dialogHeader: "<no dialogHeader>",
      dialogText: "<no dialogText>",
      dialogVisible: false,
    };
  },
  beforeMount() {
    this.loadReport();
  },
  mounted() {
    this.$store.watch(() => this.$store.getters.getCurrentAccountId,
      () => {
        this.loadReport();
      }
    )
  },
  methods: {
    setAllDetailsPage(rideId) {
      for (let i = 0; i < this.rides.length; i++) {
        if (this.rides[i].id == rideId) {
          this.rideShowingDetails = this.rides[i];
        }
      }
      this.isAllDetailsPage = true;
      this.$store.commit('setDashboardTitle', "Ride Details");
      this.$store.commit('setHasBackButton', true);
    },
    joinRide(rideId) {
      this.rides = [];
      this.isLoading = true;
      if (this.$store.state.currentAccountType == "driver") {
        this.$axios
          .post("/driver-ride-join", {
            driverId: this.$store.state.currentAccountId,
            rideId: rideId
          })
          .then(result => {
            if (result.data.ok) {
              this.showDialog("Success", result.data.msge);
            } else {
              this.showDialog("Sorry", result.data.msge);
            }
            this.isLoading = false;
            this.loadReport();
          })
          .catch((err) => this.showDialog("Failed", err));
      } else {
        this.$axios
          .post("/passenger-ride-join", {
            passengerId: this.$store.state.currentAccountId,
            rideId: rideId
          })
          .then(result => {
            if (result.data.ok) {
              this.showDialog("Success", result.data.msge);
            } else {
              this.showDialog("Sorry", result.data.msge);
            }
            this.isLoading = false;
            this.loadReport();
          })
          .catch((err) => this.showDialog("Failed", err));
      }
    },
    loadReport() {
      this.rides = [];
      this.isLoading = true;
      if (this.$store.state.currentAccountType == "driver") {
        this.$axios
          .get(`/authorized-rides/${this.$store.state.currentAccountId}`)
          .then(result => {
            for (let ride of result.data) {
              if (ride.drivers.length > 0) {
                let alreadySignedUp = false;
                for (let driver of ride.drivers) {
                  if (this.$store.state.currentAccountId == driver.id) {
                    alreadySignedUp = true;
                  }
                }
                if (!alreadySignedUp) {
                  this.rides.push(ride);
                }
              } else {
                this.rides.push(ride);
              }
            }
            this.isLoading = false;
          });
      } else {
        this.$axios
          .get("/rides")
          .then(result => {
            for (let ride of result.data) {
              if (ride.passengers.length > 0) {
                let alreadySignedUp = false;
                for (let passenger of ride.passengers) {
                  if (this.$store.state.currentAccountId == passenger.id) {
                    alreadySignedUp = true;
                  }
                }
                if (!alreadySignedUp) {
                  this.rides.push(ride);
                }
              } else {
                this.rides.push(ride);
              }
            }
            this.isLoading = false;
          });
      }
    },
    showDialog(header, text) {
      this.dialogHeader = header;
      this.dialogText = text;
      this.dialogVisible = true;
    },

    hideDialog() {
      this.dialogVisible = false;
    },
  }
}
</script>

<style scoped>
  .report-container {
    width: 90%;
    margin: auto;
    margin-top: 20px;
    padding-bottom: 30px;
  }
  .ride {
    display: flex; 
    height: 70px;
    margin-bottom: 15px;
  }
  .ride-card {
    width: 80%;
    border-radius: 5px;
    padding: 6px;
    padding-left: 10px;
    padding-right: 10px;
    display: flex;
    justify-content: space-between;
    box-shadow: 0px 4px 6px 0px rgb(196, 196, 196);
    background: rgb(247, 247, 247);
  }
  .details-button {
    width: 20%;
    margin-left: 10px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    box-shadow: 0px 4px 5px 0px rgb(161, 161, 161);
    background: rgb(155, 155, 155);
    font-size: 18px;
    text-align: center;
    font-family: 'Abel', sans-serif;
    color: white;
    padding: 10px;
  }
  .details-button:hover {
    cursor: pointer;
    background: rgb(107, 107, 107);
  }
  .join-button {
    width: 15%;
    margin-left: 10px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    box-shadow: 0px 4px 5px 0px rgb(161, 161, 161);
    background: rgb(155, 155, 155);
    font-size: 18px;
    text-align: center;
    font-family: 'Abel', sans-serif;
    color: white;
    padding: 10px;
  }
  .join-button:hover {
    cursor: pointer;
    background: rgb(107, 107, 107);
  }
  .see-details {
    margin: auto;
    text-align: center;
  }
  .left-text {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .right-text {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    font-size: 18px;
    text-align: right;
    align-items: flex-end;
  }
  .location {
    font-family: 'Abel', sans-serif;
    font-size: 20px;
  }
  span {
    vertical-align: center;
    padding: 1px;
  }
  .arrow {
    margin: 0px;
    vertical-align: bottom;
    display: inline !important;
  }
  .distanceAndCapacity {
    display: flex;
    justify-content: space-between;
    width: 80%;
    font-size: 15px;
  }
  .distance {
    font-family: 'Abel', sans-serif;
  }
  .capacity {
    font-family: 'Abel', sans-serif;
  }
  .all-details-container {
    width: 60%;
    margin: auto;
    margin-top: 30px;
    font-family: 'Abel', sans-serif;
    font-size: 22px;
    padding-bottom: 50px;
  }
  .detail {
    display: flex;
    justify-content: space-between;
  }
  .person-details {
    margin-left: 30px;
  }
</style>
