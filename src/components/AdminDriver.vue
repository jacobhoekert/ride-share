<template>
  <div>
    <div v-if="$store.state.hasBackButton && isAuthorizeDriverPage" class="add-driver-container">
      <v-form v-model="valid">
        <v-select
          class="select"
          v-model="selectedDriver"
          v-bind:rules="rules.required"
          :items="driverOptions" 
          placeholder="Select a driver"
          :clearable="false"
        ></v-select>
        <v-select
          class="select"
          v-model="selectedVehicle"
          v-bind:rules="rules.required"
          :items="vehicleOptions" 
          placeholder="Select a vehicle"
          :clearable="false"
        ></v-select>
        
        <v-btn v-bind:disabled="!valid" v-on:click="handleAddSubmit" class="submit-button"
          >Authorize This Driver
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

    <div v-else-if="$store.state.hasBackButton && isViewAuthorizedDriversPage" class="add-driver-container">
      <div class="authorized-drivers-container">
        <div class="vehicle">
          <div class="vehicle-being-viewed-card">
            <div class="left-text">
              <div>
                <span class="vehicle-name">{{vehicleBeingViewed.color}} {{vehicleBeingViewed.make}} {{vehicleBeingViewed.model}}</span>
              </div>
              <div class="bottom-left-text">
                <span class="vehicle-type">Type: {{vehicleBeingViewed.type}}</span>
                <span class="capacity">Capacity: {{vehicleBeingViewed.capacity}}</span>
              </div>
            </div>
            <div class="right-text">
              <span class="time">{{vehicleBeingViewed.licenseState}}</span>
              <span class="date">{{vehicleBeingViewed.licenseNumber}}</span>
            </div>
          </div>
        </div>
      </div>
      <p class="authorized-drivers-title">Authorized drivers for above vehicle</p>
      <hr class="hr" />
      <div v-for="driver in authorizedDrivers" :key="driver.id" class="vehicle">
        <div class="vehicle-being-viewed-card">
          <div class="left-text">
            <div>
              <span class="driver-name">{{driver.firstName}} {{driver.lastName}}</span>
            </div>
            <div class="bottom-left-text">
              <span class="phone">Phone: {{driver.phone}}</span>
            </div>
          </div>
          <div class="right-text">
            <span class="time">License Number:</span>
            <span class="time">{{driver.licenseNumber}}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="report-container">
      <div v-if="!isLoading && vehicles.length == 0">
        <p>There are no vehicles with authorized drivers. Click AUTHORIZE A DRIVER to change that!</p>
      </div>
      <div v-if="isLoading">
        <p>Loading...</p>
      </div>
      <div v-for="vehicle in vehicles" :key="vehicle.id" class="vehicle">
        <div class="vehicle-card">
          <div class="left-text">
            <div>
              <span class="name">{{vehicle.color}} {{vehicle.make}} {{vehicle.model}}</span>
            </div>
            <div class="typeAndCapacity">
              <span class="distance">Type: {{vehicle.type}}</span>
              <span class="capacity">Capacity: {{vehicle.capacity}}</span>
            </div>
          </div>
          <div class="right-text">
            <span class="time">{{vehicle.licenseState}}</span>
            <span class="date">{{vehicle.licenseNumber}}</span>
          </div>
        </div>
        <div v-on:click="setViewAuthorizedDriversPage(vehicle.id)" class="details-button">
          <p class="view-drivers">View Authorized Drivers</p>
        </div>
      </div>
      <div v-on:click="setAuthorizeDriverPage" class="add-button">
        <p class="authorize-driver">Authorize A Driver</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      isAuthorizeDriverPage: false,
      isViewAuthorizedDriversPage: false,
      vehicleBeingViewed: null,

      selectedDriver: null,
      selectedVehicle: null,

      vehicleTypes: [],
      vehicles: [],
      drivers: [],
      authorizedDrivers: [],

      valid: false,

      newAuthorization: {
        vehicleId: null,
        driverId: null
      },

      vehicleOptions: [],
      vehicleIds: [],
      driverOptions: [],
      driverIds: [],

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
      .get("/drivers")
      .then(result => {
        for (let driver of result.data) {
          this.driverOptions.push(`${driver.firstName} ${driver.lastName} (LN: ${driver.licenseNumber})`);
          this.driverIds.push(driver.id);
        }
      });
    this.$axios
      .get("/vehicles")
      .then(result => {
        for (let vehicle of result.data) {
          this.vehicles.push(vehicle);
          this.vehicleOptions.push(`${vehicle.color} ${vehicle.make} ${vehicle.model} (${vehicle.licenseState} ${vehicle.licenseNumber})`);
          this.vehicleIds.push(vehicle.id);
        }
        this.isLoading = false;
      });
  },
  methods: {
    setAuthorizeDriverPage() {
      this.isAuthorizeDriverPage = true;
      this.$store.commit('setDashboardTitle', "Authorize driver to use a vehicle");
      this.$store.commit('setHasBackButton', true);
    },
    setViewAuthorizedDriversPage(vehicleId) {
      this.isAuthorizeDriverPage = false;
      this.isViewAuthorizedDriversPage = true;
      for (let i = 0; i < this.vehicles.length; i++) {
        if (this.vehicles[i].id == vehicleId) {
          this.vehicleBeingViewed = this.vehicles[i];
        }
      }
      this.authorizedDrivers = [];
      this.$axios
        .get(`/authorized-drivers/${this.vehicleBeingViewed.id}`)
        .then(result => {
          for (let driver of result.data) {
            this.authorizedDrivers.push(driver);
          }
        });
      this.$store.commit('setDashboardTitle', "Authorized drivers for this vehicle");
      this.$store.commit('setHasBackButton', true);
    },
    handleAddSubmit() {
      // match the selected driver from dropdown to the driver's id to send to server
      for (let i = 0; i < this.driverOptions.length; i++) {
        if (this.driverOptions[i] == this.selectedDriver) {
          this.newAuthorization.driverId = parseInt(this.driverIds[i]);
        }
      }

      // match the selected vehicle from dropdown to the vehicle's id to send to server
      for (let i = 0; i < this.vehicleOptions.length; i++) {
        if (this.vehicleOptions[i] == this.selectedVehicle) {
          this.newAuthorization.vehicleId = parseInt(this.vehicleIds[i]);
        }
      }
      
      this.$axios
        .post("/authorization", {
          driverId: this.newAuthorization.driverId,
          vehicleId: this.newAuthorization.vehicleId
        })
        .then((result) => {
          if (result.data.ok) {
            this.showDialog("Success", result.data.msge);
          } else {
            this.showDialog("Sorry", result.data.msge);
          }
          this.vehicles = [];
          this.$axios
            .get("/vehicles")
            .then(result => {
              for (let vehicle of result.data) {
                this.vehicles.push(vehicle)
              }
            });
        })
        .catch((err) => this.showDialog("Failed", err));
      
    },

    handleUpdateSubmit() {
      this.$axios
        .patch(`/vehicles/${this.vehicleBeingUpdated.id}`, {
          make: this.updatedVehicle.make,
          model: this.updatedVehicle.model,
          color: this.updatedVehicle.color,
          type: this.updatedVehicle.type,
          capacity: parseInt(this.updatedVehicle.capacity),
          licenseState: this.updatedVehicle.licenseState,
          licenseNumber: this.updatedVehicle.licenseNumber
        })
        .then((result) => {
          if (result.data.ok) {
            this.showDialog("Success", result.data.msge);
          } else {
            this.showDialog("Sorry", result.data.msge);
          }
          this.vehicles = [];
          this.$axios
            .get("/vehicles")
            .then(result => {
              for (let vehicle of result.data) {
                this.vehicles.push(vehicle)
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
  .view-container {
    width: 100%;
    margin: auto;
    margin-top: 20px;
    padding-bottom: 100px;
  }
  .authorized-drivers-container {
    width: 100%;
    margin: auto;
    margin-top: 20px;
  }
  .vehicle {
    display: flex; 
    height: 70px;
    margin-bottom: 15px;
  }
  .vehicle-card {
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
  .vehicle-being-viewed-card {
    width: 100%;
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
  .view-drivers {
    text-align: center;
    margin: auto;
    font-size: 14px;
  }
  .left-text {
    height: 100%;
    display: flex;
    width: 60%;
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
  .bottom-left-text {
    display: flex;
    width: 100%;
    font-size: 15px;
  }
  .vehicle-type {
    font-family: 'Abel', sans-serif;
  }
  .capacity {
    font-family: 'Abel', sans-serif;
    margin-left: 20px;
  }
  .add-button {
    width: 30%;
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
  .authorize-driver {
    margin: auto;
    margin-top: 10px;
  }
  .add-driver-container {
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
  .input {
    font-size: 20px;
  }
  .submit-button {
    margin-top: 20px;
    width: 100%;
  }
  .vehicle-name {
    font-size: 23px;
  }
  .driver-name {
    font-size: 23px;
  }
  .authorized-drivers-title {
    margin: auto;
    margin-top: 40px;
    text-align: center;
    font-size: 25px;
    font-family: 'Abel', sans-serif;
  }
  .hr {
    font-weight: 400;
    margin-bottom: 20px;
  }
</style>
