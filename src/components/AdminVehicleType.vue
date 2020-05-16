<template>
  <div>
    <div v-if="$store.state.hasBackButton && isAddVehicleTypePage" class="add-update-container">
      <v-form v-model="valid">
        <v-text-field
          class="input"
          v-model="newVehicleType.type"
          v-bind:rules="rules.required"
          label="Vehicle Type"
        ></v-text-field>
        <v-btn v-bind:disabled="!valid" v-on:click="handleAddSubmit" class="submit-button"
          >Add Vehicle Type
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
      <div v-if="!isLoading && vehicleTypes.length == 0">
        <p>There are no vehicle types. Click ADD VEHICLE TYPE to change that!</p>
      </div>
      <div v-if="isLoading">
        <p>Loading...</p>
      </div>
      <div v-for="vehicleType in vehicleTypes" :key="vehicleType.id" class="vehicle-type">
        <div class="vehicle-type-card">
          <div class="left-text">
            <div>
              <span class="vehicle-type-name">{{vehicleType}}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-on:click="setAddVehiclePage" class="add-button">
        <p class="add-vehicle-type">Add Vehicle Type</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      isAddVehicleTypePage: false,

      vehicleTypes: [],

      valid: false,

      newVehicleType: {
        type: ""
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
    this.$axios
      .get("/vehicle-types")
      .then(result => {
        for (let vehicleType of result.data) {
          this.vehicleTypes.push(vehicleType.type);
        }
        this.isLoading = false;
      });
  },
  methods: {
    setAddVehiclePage() {
      this.isAddVehicleTypePage = true;
      this.$store.commit('setDashboardTitle', "Add A New Vehicle Type");
      this.$store.commit('setHasBackButton', true);
    },
    handleAddSubmit() {
      this.$axios
        .post("/vehicle-types", {
          type: this.newVehicleType.type
        })
        .then((result) => {
          if (result.data.ok) {
            this.showDialog("Success", result.data.msge);
          } else {
            this.showDialog("Sorry", result.data.msge);
          }
          this.vehicleTypes = [];
          this.$axios
            .get("/vehicle-types")
            .then(result => {
              for (let vehicleType of result.data) {
                this.vehicleTypes.push(vehicleType.type)
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
    width: 70%;
    margin: auto;
    margin-top: 30px;
    padding-bottom: 100px;
  }
  .vehicle-type {
    display: flex; 
    height: 70px;
    margin-bottom: 15px;
  }
  .vehicle-type-card {
    width: 100%;
    margin: auto;
    height: 70px;
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
  .edit-vehicle-type {
    text-align: center;
    margin: auto;
  }
  .left-text {
    height: 100%;
    display: flex;
    width: 45%;
    flex-direction: column;
    justify-content: center;
  }
  span {
    vertical-align: center;
    padding: 1px;
  }
  .vehicle-type-name {
    font-size: 25px;
    margin-left: 20px;
  }
  .arrow {
    margin: 0px;
    vertical-align: bottom;
    display: inline !important;
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
  .add-vehicle-type {
    margin: auto;
    margin-top: 10px;
  }
  .add-update-container {
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
</style>
