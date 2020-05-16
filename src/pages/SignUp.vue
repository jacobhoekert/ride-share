<template>
  <div>
    <div class="sign-up-container">
      <v-btn v-on:click="goBack" class="button" text>
        <span class="btn-text">Back</span>
      </v-btn>
      <div class="sign-up-title">Sign Up</div>
      <v-form v-model="valid">
        <v-select
          class="select"
          v-model="accountType"
          v-bind:rules="rules.required"
          :items="['Driver', 'Passenger']" 
          placeholder="Driver or Passenger?"
          :clearable="false"
        ></v-select>
        <v-text-field
          class="input"
          v-model="newAccount.firstName"
          v-bind:rules="rules.required"
          label="First Name"
        ></v-text-field>
        <v-text-field
          class="input"
          v-model="newAccount.lastName"
          v-bind:rules="rules.required"
          label="Last Name"
        ></v-text-field>
        <v-text-field
          class="input"
          v-model="newAccount.phone"
          v-bind:rules="rules.required"
          label="Phone Number"
        ></v-text-field>
        <v-text-field
          v-if="accountType == 'Driver'"
          class="input"
          v-model="newAccount.licenseNumber"
          v-bind:rules="rules.required"
          type="number"
          label="License Number"
        ></v-text-field>
        <v-btn v-bind:disabled="!valid" v-on:click="handleAddSubmit" class="submit-button"
          >Sign Up
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
     
      valid: false,

      accountType: null,

      newAccount: {
        firstName: null,
        lastName: null,
        phone: null,
        licenseNumber: "earlobe",
      },

      dialogHeader: "<no dialogHeader>",
      dialogText: "<no dialogText>",
      dialogVisible: false,

      rules: {
        required: [(val) => val.length > 0 || "Required"],
      },
    };
  },
  methods: {
    handleAddSubmit() {
      this.$axios
        .post("/sign-up", {
          firstName: this.newAccount.firstName,
          lastName: this.newAccount.lastName,
          phone: this.newAccount.phone,
          licenseNumber: this.newAccount.licenseNumber,
        })
        .then((result) => {
          if (result.data.ok) {
            this.showDialog("Success", result.data.msge);
          } else {
            this.showDialog("Sorry", result.data.msge);
          }
        })
        .catch((err) => this.showDialog("Failed", err));
      
    },
    goBack() {
      this.$router.push({ path: "/" });
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
  .sign-up-container {
    width: 35%;
    margin: auto;
    margin-top: 130px;
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
  .button {
    color: white;
    background: rgb(89, 89, 212);
    width: 150px;
    font-size: 18px;
    margin: auto;
    font-family: 'Abel', sans-serif;
    margin-right: 10px;
    margin-bottom: 50px;
  }
  .sign-up-title {
    text-align: center;
    margin: auto;
    font-family: 'Abel', sans-serif;
    font-size: 30px;
    margin-bottom: 30px;
  }
</style>
