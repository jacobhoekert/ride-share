<template>
  <div>
    <div v-if="$store.state.hasBackButton && isAddRidePage" class="add-ride-container">
      <div v-if="noVehicles" class="no-vehicles-text">
        There are no vehicles in the system. You must register a vehicle before you can create a ride.
      </div>
      <v-form v-else v-model="valid">
        <v-menu
          v-model="dateMenu"
          v-bind:rules="rules.required"
          :close-on-content-click="false"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              label="Date"
              prepend-icon="event"
              readonly
              :value="dateDisplay"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            locale="en-in"
            v-model="newRide.date"
            no-title
            @input="dateMenu = false"
            :min="minDate"
          ></v-date-picker>
        </v-menu>
        <v-menu
          v-model="timeMenu"
          v-bind:rules="rules.required"
          :close-on-content-click="false"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              label="Time"
              prepend-icon="event"
              readonly
              :value="timeDisplay"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-model="newRide.time"
          ></v-time-picker>
        </v-menu>
        <v-text-field
          v-model="newRide.fromLocation"
          label="From Location Name"
          v-bind:rules="rules.required"
        ></v-text-field>
        <v-text-field
          class="indented-text-field"
          v-model="newRide.fromAddress"
          label="From Location Address"
          v-bind:rules="rules.required"
        ></v-text-field>
        <v-text-field
          class="indented-text-field"
          v-model="newRide.fromCity"
          label="From Location City"
          v-bind:rules="rules.required"
        ></v-text-field>
        <v-text-field
          class="indented-text-field"
          v-model="newRide.fromState"
          label="From Location State"
          v-bind:rules="rules.required"
        ></v-text-field>
        <v-text-field
          class="indented-text-field"
          v-model="newRide.fromZipCode"
          label="From Location Zipcode"
          v-bind:rules="rules.required"
        ></v-text-field>
        <v-text-field
          v-model="newRide.toLocation"
          label="To Location Name"
          v-bind:rules="rules.required"
        ></v-text-field>
        <v-text-field
          class="indented-text-field"
          v-model="newRide.toAddress"
          label="To Location Address"
          v-bind:rules="rules.required"
        ></v-text-field>
        <v-text-field
          class="indented-text-field"
          v-model="newRide.toCity"
          label="To Location City"
          v-bind:rules="rules.required"
        ></v-text-field>
        <v-text-field
          class="indented-text-field"
          v-model="newRide.toState"
          label="To Location State"
          v-bind:rules="rules.required"
        ></v-text-field>
        <v-text-field
          class="indented-text-field"
          v-model="newRide.toZipCode"
          label="To Location Zipcode"
          v-bind:rules="rules.required"
        ></v-text-field>
        
        <v-text-field
          v-model="newRide.distance"
          v-bind:rules="rules.required"
          label="Distance in Miles"
        ></v-text-field>
        <v-select
          class="select"
          v-model="selectedVehicle"
          v-bind:rules="rules.required"
          :items="vehicleOptions" 
          placeholder="Select a vehicle for the ride"
          :clearable="false"
        ></v-select>
        <v-btn v-bind:disabled="!valid" v-on:click="handleAddSubmit" class="submit-button"
          >Add Ride
        </v-btn>
      </v-form>
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

    <div v-else-if="$store.state.hasBackButton && isUpdateRidePage" class="add-ride-container">
      <v-form v-model="valid">
        <v-menu
          v-model="updatedDateMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              label="Date"
              prepend-icon="event"
              readonly
              :value="updatedDateDisplay"
              :placeholder="rideBeingUpdated.date"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            locale="en-in"
            v-model="updatedRide.date"
            no-title
            @input="dateMenu = false"
            :min="minDate"
          ></v-date-picker>
        </v-menu>
        <v-menu
          v-model="updatedTimeMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              label="Time"
              prepend-icon="event"
              readonly
              :value="updatedTimeDisplay"
              :placeholder="rideBeingUpdated.time"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-model="updatedRide.time"
          ></v-time-picker>
        </v-menu>
        <v-text-field
          v-model="updatedRide.fromLocation"
          label="From Location Name"
          :placeholder="rideBeingUpdated.fromLocation"
        ></v-text-field>
        <v-text-field
          class="indented-text-field"
          v-model="updatedRide.fromAddress"
          label="From Location Address"
          :placeholder="rideBeingUpdatedFromLocation.address"
        ></v-text-field>
        <v-text-field
          class="indented-text-field"
          v-model="updatedRide.fromCity"
          label="From Location City"
          :placeholder="rideBeingUpdatedFromLocation.city"
        ></v-text-field>
        <v-text-field
          class="indented-text-field"
          v-model="updatedRide.fromState"
          label="From Location State"
          :placeholder="rideBeingUpdatedFromLocation.state"
        ></v-text-field>
        <v-text-field
          class="indented-text-field"
          v-model="updatedRide.fromZipCode"
          label="From Location Zipcode"
          :placeholder="rideBeingUpdatedFromLocation.zipCode"
        ></v-text-field>
        <v-text-field
          v-model="updatedRide.toLocation"
          label="To Location Name"
          :placeholder="rideBeingUpdated.toLocation"
        ></v-text-field>
        <v-text-field
          class="indented-text-field"
          v-model="updatedRide.toAddress"
          label="To Location Address"
          :placeholder="rideBeingUpdatedToLocation.address"
        ></v-text-field>
        <v-text-field
          class="indented-text-field"
          v-model="updatedRide.toCity"
          label="To Location City"
          :placeholder="rideBeingUpdatedToLocation.city"
        ></v-text-field>
        <v-text-field
          class="indented-text-field"
          v-model="updatedRide.toState"
          label="To Location State"
          :placeholder="rideBeingUpdatedToLocation.state"
        ></v-text-field>
        <v-text-field
          class="indented-text-field"
          v-model="updatedRide.toZipCode"
          label="To Location Zipcode"
          :placeholder="rideBeingUpdatedToLocation.zipCode"
        ></v-text-field>
        <v-text-field
          v-model="updatedRide.distance"
          label="Distance in Miles"
          :placeholder="rideBeingUpdated.distance"
        ></v-text-field>
        <v-select
          class="select"
          v-model="updatedSelectedVehicle"
          :items="vehicleOptions" 
          :placeholder="rideBeingUpdated.vehicle"
          :clearable="false"
        ></v-select>
        <v-btn v-bind:disabled="!valid" v-on:click="handleUpdateSubmit" class="submit-button"
          >Update Ride
        </v-btn>
      </v-form>
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

    <div v-else class="report-container">
      <div v-if="!isLoading && rides.length == 0">
        <p>There are no rides. Click ADD A RIDE to change that!</p>
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
        <div v-on:click="setUpdateRidePage(ride.id)" class="details-button">
          <p class="edit-ride">Update Ride</p>
        </div>
      </div>
      <div v-on:click="setAddRidePage" class="add-button">
        <p class="add-ride">Add Ride</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      isAddRidePage: false,
      isUpdateRidePage: false,
      rideBeingUpdated: null,
      rideBeingUpdatedFromLocation: null,
      rideBeingUpdatedToLocation: null,

      noVehicles: false,

      dateMenu: false,
      updatedDateMenu: false,
      minDate: "2019-07-04",
      maxDate: "2019-08-30",
      timeMenu: false,
      updatedTimeMenu: false,

      newRide: {
        fromLocation: "",
        fromAddress: "",
        fromCity: "",
        fromState: "",
        fromZipCode: "",
        toLocation: "",
        toAddress: "",
        toCity: "",
        toState: "",
        toZipCode: "",
        date: null,
        time: null,
        distance: null,
        vehicleId: null
      },

      updatedRide: {
        fromLocation: null,
        fromAddress: null,
        fromCity: null,
        fromState: null,
        fromZipCode: null,
        toLocation: null,
        toAddress: null,
        toCity: null,
        toState: null,
        toZipCode: null,
        date: null,
        time: null,
        distance: null,
        vehicleId: null
      },

      rides: [],
      vehicleOptions: [],
      vehicleIds: [],
      selectedVehicle: null,
      updatedSelectedVehicle: null,

      dialogHeader: "<no dialogHeader>",
      dialogText: "<no dialogText>",
      dialogVisible: false,

      rules: {
        required: [(val) => val.length > 0 || "Required"],
      },
    };
  },
  beforeMount() {
    this.isLoading = true;
    this.$axios
      .get("/rides")
      .then(result => {
        for (let ride of result.data) {
          this.rides.push(ride)
        }
        this.isLoading = false;
      });
    this.$axios
      .get("/vehicles")
      .then(result => {
        for (let vehicle of result.data) {
          this.vehicleOptions.push(`${vehicle.color} ${vehicle.make} ${vehicle.model} (${vehicle.licenseState} ${vehicle.licenseNumber})`);
          this.vehicleIds.push(vehicle.id);
        }
        this.isLoading = false;
        if (this.vehicleOptions.length < 1) {
          this.noVehicles = true;
        }
      });
    
  },
  computed: {
    dateDisplay() {
      return this.newRide.date;
    },
    timeDisplay() {
      return this.newRide.time;
    },
    updatedDateDisplay() {
      return this.updatedRide.date;
    },
    updatedTimeDisplay() {
      return this.updatedRide.time;
    }
  },
  methods: {
    setAddRidePage() {
      this.isAddRidePage = true;
      this.$store.commit('setDashboardTitle', "Add A New Ride");
      this.$store.commit('setHasBackButton', true);
    },

    setUpdateRidePage(rideId) {
      this.isAddRidePage = false;
      this.isUpdateRidePage = true;
      for (let i = 0; i < this.rides.length; i++) {
        if (this.rides[i].id == rideId) {
          this.rideBeingUpdated = this.rides[i];
        }
      }
      this.$axios
        .get(`/locations/${this.rideBeingUpdated.from_location_id}`)
        .then(result => {
          this.rideBeingUpdatedFromLocation = result.data;
        });

      this.$axios
        .get(`/locations/${this.rideBeingUpdated.to_location_id}`)
        .then(result => {
          this.rideBeingUpdatedToLocation = result.data;
        });
      this.$store.commit('setDashboardTitle', "Update Ride");
      this.$store.commit('setHasBackButton', true);
    },

    handleAddSubmit() {
      // match the selected vehicle from dropdown to the vehicle's id to send to server
      for (let i = 0; i < this.vehicleOptions.length; i++) {
        if (this.vehicleOptions[i] == this.selectedVehicle) {
          this.newRide.vehicleId = this.vehicleIds[i];
        }
      }
      // Format time to locale 12 hour time
      const splitTime = this.newRide.time.split(':');
      let newSplitTime = [];
      let formattedTime = null;
      if (parseInt(splitTime[0]) >= 12) {
        if (splitTime[0] == '12') {
          newSplitTime.push(12);
        } else {
          newSplitTime.push(parseInt(splitTime[0]) - 12);
        }
        newSplitTime.push(splitTime[1]);
        formattedTime = newSplitTime.join(":") + " PM";
      } else {
        if (splitTime[0] == '00') {
          newSplitTime.push(12);
        } else {
          newSplitTime.push(parseInt(splitTime[0]));
        }
        newSplitTime.push(splitTime[1]);
        formattedTime = newSplitTime.join(":") + " AM";
      }

      this.$axios
        .post("/rides", {
          fromLocation: this.newRide.fromLocation,
          fromAddress: this.newRide.fromAddress,
          fromCity: this.newRide.fromCity,
          fromState: this.newRide.fromState,
          fromZipCode: this.newRide.fromZipCode,
          toLocation: this.newRide.toLocation,
          toAddress: this.newRide.toAddress,
          toCity: this.newRide.toCity,
          toState: this.newRide.toState,
          toZipCode: this.newRide.toZipCode,
          date: this.newRide.date,
          time: formattedTime,
          distance: this.newRide.distance,
          vehicleId: this.newRide.vehicleId
        })
        .then((result) => {
          if (result.data.ok) {
            this.showDialog("Success", result.data.msge);
          } else {
            this.showDialog("Sorry", result.data.msge);
          }
          this.rides = [];
          this.$axios
            .get("/rides")
            .then(result => {
              for (let ride of result.data) {
                this.rides.push(ride);
              }
            });
        })
        .catch((err) => this.showDialog("Failed", err));
    },

    handleUpdateSubmit() {
      // if vehicle was updated, match the selected vehicle from dropdown to the vehicle's id to send to server
      if (this.updatedSelectedVehicle != null) {
        for (let i = 0; i < this.vehicleOptions.length; i++) {
          if (this.vehicleOptions[i] == this.updatedSelectedVehicle) {
            this.updatedRide.vehicleId = this.vehicleIds[i];
          }
        }
      }

      // if time was updated, Format time to locale 12 hour time
      let formattedTime = null;
      if (this.updatedRide.time != null) {
        const splitTime = this.updatedRide.time.split(':');
        let newSplitTime = [];
        if (parseInt(splitTime[0]) >= 12) {
         if (splitTime[0] == '12') {
          newSplitTime.push(12);
          } else {
            newSplitTime.push(parseInt(splitTime[0]) - 12);
          }
          newSplitTime.push(splitTime[1]);
          formattedTime = newSplitTime.join(":") + " PM";
        } else {
          if (splitTime[0] == '00') {
            newSplitTime.push(12);
          } else {
            newSplitTime.push(parseInt(splitTime[0]));
          }
          newSplitTime.push(splitTime[1]);
          formattedTime = newSplitTime.join(":") + " AM";
        }
      }

      this.$axios
        .patch(`/rides/${this.rideBeingUpdated.id}`, {
          fromLocationId: this.rideBeingUpdated.from_location_id,
          toLocationId: this.rideBeingUpdated.to_location_id,
          fromLocation: this.updatedRide.fromLocation,
          fromAddress: this.updatedRide.fromAddress,
          fromCity: this.updatedRide.fromCity,
          fromState: this.updatedRide.fromState,
          fromZipCode: this.updatedRide.fromZipCode,
          toLocation: this.updatedRide.toLocation,
          toAddress: this.updatedRide.toAddress,
          toCity: this.updatedRide.toCity,
          toState: this.updatedRide.toState,
          toZipCode: this.updatedRide.toZipCode,
          date: this.updatedRide.date,
          time: formattedTime,
          distance: this.updatedRide.distance,
          vehicleId: this.updatedRide.vehicleId
        })
        .then((result) => {
          if (result.data.ok) {
            this.showDialog("Success", result.data.msge);
          } else {
            this.showDialog("Sorry", result.data.msge);
          }
          this.rides = [];
          this.$axios
            .get("/rides")
            .then(result => {
              for (let ride of result.data) {
                this.rides.push(ride);
              }
            });
        })
        .catch((err) => this.showDialog("Failed", err));
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
    padding-bottom: 100px;
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
  .edit-ride {
    text-align: center;
    margin: auto;
  }
  .left-text {
    height: 100%;
    width: 60%;
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
    width: 100%;
    font-size: 15px;
  }
  .distance {
    font-family: 'Abel', sans-serif;
  }
  .capacity {
    font-family: 'Abel', sans-serif;
    margin-left: 15px;
  }
  .add-button {
    width: 20%;
    height: 50px;
    margin-top: 20px;
    margin-left: 10px;
    border-radius: 5px;
    display: flex;
    float: right;
    box-shadow: 0px 4px 5px 0px rgb(161, 161, 161);
    background: rgb(155, 155, 155);
    font-size: 18px;
    text-align: center;
    font-family: 'Abel', sans-serif;
    color: white;
  }
  .add-button:hover {
    cursor: pointer;
    background: rgb(107, 107, 107);
  }
  .add-ride {
    margin: auto;
    margin-top: 10px;
  }
  .add-ride-container {
    width: 60%;
    margin: auto;
    margin-top: 30px;
    font-family: 'Abel', sans-serif;
    padding-bottom: 50px;
  }
  .select {
    width: 100%;
    font-size: 20px;
    font-family: 'Abel', sans-serif;
  }
  .submit-button {
    margin-top: 20px;
    width: 100%;
  }
  .indented-text-field {
    margin-left: 30px;
  }
  .no-vehicles-text {
    font-size: 25px;
    text-align: center;
  }
</style>
