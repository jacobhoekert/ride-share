<template>
  <div>
    <div v-if="$store.state.hasBackButton && isAddVehiclePage" class="add-update-vehicle-container">
      <div v-if="noVehicleTypes" class="no-vehicle-types-text">
        There are no vehicle types in the system. You must register a vehicle type before you can create a vehicle.
      </div>
      <v-form v-else v-model="valid">
        <v-text-field
          class="input"
          v-model="newVehicle.make"
          v-bind:rules="rules.required"
          label="Make"
        ></v-text-field>
        <v-text-field
          class="input"
          v-model="newVehicle.model"
          v-bind:rules="rules.required"
          label="Model"
        ></v-text-field>
        <v-text-field
          class="input"
          v-model="newVehicle.color"
          v-bind:rules="rules.required"
          label="Color"
        ></v-text-field>
        <v-select
          class="select"
          v-model="newVehicle.type"
          v-bind:rules="rules.required"
          :items="vehicleTypes" 
          placeholder="Select a Vehicle Type"
          :clearable="false"
        ></v-select>
        <v-text-field
          class="input"
          v-model="newVehicle.capacity"
          v-bind:rules="rules.required"
          type="number"
          label="Capacity"
        ></v-text-field>
        <v-text-field
          class="input"
          v-model="newVehicle.licenseState"
          v-bind:rules="rules.required"
          label="License State"
        ></v-text-field>
        <v-text-field
          class="input"
          v-model="newVehicle.licenseNumber"
          v-bind:rules="rules.required"
          label="License Number"
        ></v-text-field>
        <v-btn v-bind:disabled="!valid" v-on:click="handleAddSubmit" class="submit-button"
          >Add Vehicle
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

    <div v-else-if="$store.state.hasBackButton && isUpdateVehiclePage" class="add-update-vehicle-container">
      <v-form v-model="valid">
        <v-text-field
          class="input"
          v-model="updatedVehicle.make"
          :placeholder="vehicleBeingUpdated.make"
          label="Make"
        ></v-text-field>
        <v-text-field
          class="input"
          v-model="updatedVehicle.model"
          :placeholder="vehicleBeingUpdated.model"
          label="Model"
        ></v-text-field>
        <v-text-field
          class="input"
          v-model="updatedVehicle.color"
          :placeholder="vehicleBeingUpdated.color"
          label="Color"
        ></v-text-field>
        <v-select
          class="select"
          v-model="updatedVehicle.type"
          :placeholder="vehicleBeingUpdated.type"
          :items="vehicleTypes" 
          :clearable="false"
        ></v-select>
        <v-text-field
          class="input"
          v-model="updatedVehicle.capacity"
          :placeholder="vehicleBeingUpdated.capacity"
          type="number"
          label="Capacity"
        ></v-text-field>
        <v-text-field
          class="input"
          v-model="updatedVehicle.licenseState"
          :placeholder="vehicleBeingUpdated.licenseState"
          label="License State"
        ></v-text-field>
        <v-text-field
          class="input"
          v-model="updatedVehicle.licenseNumber"
          :placeholder="vehicleBeingUpdated.licenseNumber"
          label="License Number"
        ></v-text-field>
        <v-btn v-bind:disabled="!valid" v-on:click="handleUpdateSubmit" class="submit-button"
          >Update Vehicle
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
      <div v-if="!isLoading && vehicles.length == 0">
        <p>There are no vehicles. Click ADD VEHICLE to change that!</p>
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
        <div v-on:click="setUpdateVehiclePage(vehicle.id)" class="details-button">
          <p class="edit-vehicle">Update Vehicle</p>
        </div>
      </div>
      <div v-on:click="setAddVehiclePage" class="add-button">
        <p class="add-vehicle">Add Vehicle</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      isAddVehiclePage: false,
      isUpdateVehiclePage: false,
      vehicleBeingUpdated: null,

      vehicleTypes: [],
      vehicles: [],

      noVehicleTypes: false,

      valid: false,

      newVehicle: {
        make: "",
        model: "",
        color: "",
        type: "",
        capacity: null,
        licenseState: "",
        licenseNumber: ""
      },

      updatedVehicle: {
        make: null,
        model: null,
        color: null,
        type: null,
        capacity: null,
        licenseState: null,
        licenseNumber: null
      },

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
    this.noVehicleTypes = false;
    this.$axios
      .get("/vehicles")
      .then(result => {
        for (let vehicle of result.data) {
          this.vehicles.push(vehicle)
        }
        this.isLoading = false;
      });
    this.$axios
      .get("/vehicle-types")
      .then(result => {
        for (let vehicleType of result.data) {
          this.vehicleTypes.push(vehicleType.type);
        }
        if (this.vehicleTypes.length < 1) {
          this.noVehicleTypes = true;
        }
      });
    
  },
  methods: {
    setAddVehiclePage() {
      this.isAddVehiclePage = true;
      this.$store.commit('setDashboardTitle', "Add A New Vehicle");
      this.$store.commit('setHasBackButton', true);
    },
    setUpdateVehiclePage(vehicleId) {
      this.isAddVehiclePage = false;
      this.isUpdateVehiclePage = true;
      for (let i = 0; i < this.vehicles.length; i++) {
        if (this.vehicles[i].id == vehicleId) {
          this.vehicleBeingUpdated = this.vehicles[i];
        }
      }
      this.$store.commit('setDashboardTitle', "Update Vehicle");
      this.$store.commit('setHasBackButton', true);
    },
    handleAddSubmit() {
      this.$axios
        .post("/vehicles", {
          make: this.newVehicle.make,
          model: this.newVehicle.model,
          color: this.newVehicle.color,
          type: this.newVehicle.type,
          capacity: parseInt(this.newVehicle.capacity),
          licenseState: this.newVehicle.licenseState,
          licenseNumber: this.newVehicle.licenseNumber
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
  .edit-vehicle {
    text-align: center;
    margin: auto;
  }
  .left-text {
    height: 100%;
    display: flex;
    width: 45%;
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
  .typeAndCapacity {
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-size: 15px;
  }
  .distance {
    font-family: 'Abel', sans-serif;
  }
  .capacity {
    font-family: 'Abel', sans-serif;
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
  .add-vehicle {
    margin: auto;
    margin-top: 10px;
  }
  .add-update-vehicle-container {
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
  .no-vehicle-types-text {
    font-size: 25px;
    text-align: center;
  }
</style>
