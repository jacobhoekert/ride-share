const knex = require("knex")({
  client: "pg",
  connection: {
    host: "faraday.cse.taylor.edu",
    user: "jacob_hoekert",
    password: "xolalefe",
    database: "jacob_hoekert",
  },
});

const objection = require("objection");
objection.Model.knex(knex);

const Driver = require("./models/Driver");
const Location = require("./models/Location");
const Passenger = require("./models/Passenger");
const Ride = require("./models/Ride");
const Vehicle = require("./models/Vehicle");
const VehicleType = require("./models/VehicleType");

const Hapi = require("@hapi/hapi");

const init = async () => {
  const server = Hapi.server({
    host: "localhost",
    port: 3000,
    routes: {
      cors: true,
    },
  });

  await server.register({
    plugin: require("blipp"),
    options: { showAuth: true }
  });

  await server.register({
    plugin: require("hapi-pino"),
    options: {
      prettyPrint: true,
    }
  });
  
  server.route([
    {
      method: "GET",
      path: "/accounts",
      handler: async (request, h) => {
        try {
          const accounts = [
            {
              firstName: "Admin",
              lastName: "",
              userType: "admin"
            }
          ];
          const drivers = await Driver.query()
            .select('firstName', 'lastName');
          const passengers = await Passenger.query()
            .select('firstName', 'lastName');
          for (let driver of drivers) {
            accounts.push({
              firstName: driver.firstName,
              lastName: driver.lastName,
              userType: "driver"
            });
          }
          for (let passenger of passengers) {
            accounts.push({
              firstName: passenger.firstName,
              lastName: passenger.lastName,
              userType: "passenger"
            });
          }
          return accounts;
        } catch (err) {
          console.log(err);
        }
      }
    }, 
  ]);

  console.log("Server listening on", server.info.uri);
  await server.start();
};

init();