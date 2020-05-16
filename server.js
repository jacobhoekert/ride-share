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
const Joi = require("@hapi/joi");

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
      config: {
        description: "Retrieve all accounts (passengers, drivers, and admin)",
      },
      handler: async (request, h) => {
        try {
          const accounts = [
            {
              firstName: "Admin",
              lastName: "",
              userType: "admin",
              id: null
            }
          ];
          const drivers = await Driver.query();
          const passengers = await Passenger.query();
          for (let driver of drivers) {
            accounts.push({
              firstName: driver.firstName,
              lastName: driver.lastName,
              userType: "driver",
              id: driver.id
            });
          }
          for (let passenger of passengers) {
            accounts.push({
              firstName: passenger.firstName,
              lastName: passenger.lastName,
              userType: "passenger",
              id: passenger.id
            });
          }
          return accounts;
        } catch (err) {
          console.log(err);
        }
      }
    }, 
    {
      method: "POST",
      path: "/sign-up",
      config: {
        description: "Create a new driver or passenger",
        validate: {
          payload: Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            phone: Joi.string().required(),
            licenseNumber: Joi.string().required()
          }),
        },
      },
      handler: async (request, h) => {
        try {
          // if driver
          if (request.payload.licenseNumber != "earlobe") {
            const existingDriver = await Driver.query()
              .where("licenseNumber", request.payload.licenseNumber)
              .first();
            if (existingDriver) {
              return {
                ok: false,
                msge: `Driver already exists in the system.`,
              };
            }

            const newDriver = await Driver.query().insert({
              firstName: request.payload.firstName,
              lastName: request.payload.lastName,
              phone: request.payload.phone,
              licenseNumber: request.payload.licenseNumber
            });

            if (newDriver) {
              return {
                ok: true,
                msge: `Created new driver '${request.payload.firstName} ${request.payload.lastName}'.`,
              };
            } else {
              return {
                ok: false,
                msge: `Couldn't create new driver '${request.payload.firstName} ${request.payload.lastName}'.`,
              };
            }
          } else { //else if a passenger
            const existingPassenger = await Passenger.query()
              .where("firstName", request.payload.firstName)
              .where("lastName", request.payload.lastName)
              .where("phone", request.payload.phone)
              .first();
            if (existingPassenger) {
              return {
                ok: false,
                msge: `Passenger already exists in the system.`,
              };
            }

            const newPassenger = await Passenger.query().insert({
              firstName: request.payload.firstName,
              lastName: request.payload.lastName,
              phone: request.payload.phone,
            });

            if (newPassenger) {
              return {
                ok: true,
                msge: `Created new passenger '${request.payload.firstName} ${request.payload.lastName}'.`,
              };
            } else {
              return {
                ok: false,
                msge: `Couldn't create new passenger '${request.payload.firstName} ${request.payload.lastName}'.`,
              };
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
    {
      method: "GET",
      path: "/vehicle-types",
      config: {
        description: "Retrieve all vehicle types",
      },
      handler: async (request, h) => {
        try {
          const vehicleTypes = await VehicleType.query();
          let vehicleTypesResponse = [];
          for (let vehicleType of vehicleTypes) {
            vehicleTypesResponse.push({
              type: vehicleType.type
            });
          }
          return vehicleTypes;
        } catch (err) {
          console.log(err);
        }
      }
    },
    {
      method: "POST",
      path: "/vehicle-types",
      config: {
        description: "Create a new vehicle type",
        validate: {
          payload: Joi.object({
            type: Joi.string().required()
          }),
        },
      },
      handler: async (request, h) => {
        try {
          const existingVehicleType = await VehicleType.query()
            .where("type", request.payload.type)
            .orWhere("type", request.payload.type.toLowerCase())
            .first();
          if (existingVehicleType) {
            return {
              ok: false,
              msge: `Vehicle Type '${request.payload.type}' already exists in the system.`,
            };
          }

          const newVehicleType = await VehicleType.query().insert({
            type: request.payload.type
          });

          if (newVehicleType) {
            return {
              ok: true,
              msge: `Created new vehicle type '${request.payload.type}'.`,
            };
          } else {
            return {
              ok: false,
              msge: `Couldn't create new vehicle type '${request.payload.type}'.`,
            };
          }

        } catch (err) {
          console.log(err);
        }
      }
    },
    {
      method: "GET",
      path: "/vehicles",
      config: {
        description: "Retrieve all vehicles",
      },
      handler: async (request, h) => {
        try {
          const vehicles = await Vehicle.query();
          let vehiclesResponse = [];
          if (!vehicles) {
            return vehiclesResponse;
          }
          else {
            for (let vehicle of vehicles) {
              const vehicleType = await VehicleType.query()
                .where("id", vehicle.vehicle_type_id)
                .first();
              vehiclesResponse.push({
                id: vehicle.id,
                make: vehicle.make,
                model: vehicle.model,
                color: vehicle.color,
                type: vehicleType.type,
                capacity: vehicle.capacity,
                licenseState: vehicle.licenseState,
                licenseNumber: vehicle.licenseNumber
              });
            }
            return vehiclesResponse;
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
    {
      method: "POST",
      path: "/vehicles",
      config: {
        description: "Create a new vehicle",
        validate: {
          payload: Joi.object({
            make: Joi.string().required(),
            model: Joi.string().required(),
            color: Joi.string().required(),
            type: Joi.string().required(),
            capacity: Joi.number().integer().min(1).required(),
            licenseState: Joi.string().required(),
            licenseNumber: Joi.string().required(),
          }),
        },
      },
      handler: async (request, h) => {
        try {
          const existingVehicle = await Vehicle.query()
            .where("licenseState", request.payload.licenseState)
            .where("licenseNumber", request.payload.licenseNumber)
            .first();
          if (existingVehicle) {
            return {
              ok: false,
              msge: `Vehicle with license plate '${request.payload.licenseState}' '${request.payload.licenseNumber}' is already in the system.`,
            };
          }

          const vehicleType = await VehicleType.query()
            .where("type", request.payload.type)
            .first();

          const newVehicle = await Vehicle.query().insert({
            make: request.payload.make,
            model: request.payload.model,
            color: request.payload.color,
            vehicle_type_id: vehicleType.id,
            capacity: request.payload.capacity,
            licenseState: request.payload.licenseState,
            licenseNumber: request.payload.licenseNumber
          });

          if (newVehicle) {
            return {
              ok: true,
              msge: `Created new vehicle with license plate '${request.payload.licenseState}' '${request.payload.licenseNumber}'.`,
            };
          } else {
            return {
              ok: false,
              msge: `Couldn't create new vehicle with license plate '${request.payload.licenseState}' '${request.payload.licenseNumber}'.`,
            };
          }

        } catch (err) {
          console.log(err);
        }
      }
    },
    {
      method: "PATCH",
      path: "/vehicles/{id}",
      config: {
        description: "Update a vehicle by id",
      },
      handler: async (request, h) => {
        try {

          let patches = {};
          if (request.payload.make != null) {
            patches.make = request.payload.make;
          }
          if (request.payload.model != null) {
            patches.model = request.payload.model;
          }
          if (request.payload.color != null) {
            patches.color = request.payload.color;
          }
          if (request.payload.type != null) {
            const vehicleType = await VehicleType.query()
              .where("type", request.payload.type)
              .first();
            patches.vehice_type_id = vehicleType.id;
          }
          if (request.payload.capacity != null) {
            patches.capacity = request.payload.capacity;
          }
          if (request.payload.licenseState != null) {
            patches.licenseState = request.payload.licenseState;
          }
          if (request.payload.licenseNumber != null) {
            patches.licenseNumber = request.payload.licenseNumber;
          }
          

          const vehicleUpdated = await Vehicle.query()
            .findById(request.params.id)
            .patch(patches);
          
          if (vehicleUpdated) {
            return {
              ok: true,
              msge: `Updated vehicle!`,
            };
          } else {
            return {
              ok: false,
              msge: `No updates specified!`,
            };
          }

        } catch (err) {
          console.log(err);
        }
      }
    },
    {
      method: "GET",
      path: "/locations/{id}",
      config: {
        description: "Retrieve a location by id",
      },
      handler: async (request, h) => {
        try {
          const location = await Location.query().findById(request.params.id);

          let locationResponse = {
            name: location.name,
            address: location.address,
            city: location.city,
            state: location.state,
            zipCode: location.zipCode
          };
          return locationResponse;
        } catch (err) {
          console.log(err);
        }
      }
    },
    {
      method: "GET",
      path: "/rides",
      config: {
        description: "Retrieve all rides",
      },
      handler: async (request, h) => {
        try {
          const rides = await Ride.query()
            .withGraphFetched("fromLocation")
            .withGraphFetched("toLocation")
            .withGraphFetched("drivers")
            .withGraphFetched("passengers")
            .withGraphFetched("vehicle")
          let ridesResponse = [];
          if (!rides) {
            return ridesResponse;
          } else {
            for (let ride of rides) {
              const formattedDate = ride.date.toLocaleDateString();
  
              ridesResponse.push({
                id: ride.id,
                from_location_id: ride.from_location_id,
                to_location_id: ride.to_location_id,
                fromLocation: ride.fromLocation.name,
                toLocation: ride.toLocation.name,
                drivers: ride.drivers,
                passengers: ride.passengers,
                capacity: ride.vehicle.capacity,
                distance: `${ride.distance} m`,
                date: formattedDate,
                time: ride.time,
                vehicle: `${ride.vehicle.color} ${ride.vehicle.make} ${ride.vehicle.model}`,
                licensePlate: `${ride.vehicle.licenseState} ${ride.vehicle.licenseNumber}`,
              });
            }
            return ridesResponse;
          }
          
        } catch (err) {
          console.log(err);
        }
      }
    },
    {
      method: "GET",
      path: "/rides/driver/{id}",
      config: {
        description: "Retrieve all rides of specific driver by id",
      },
      handler: async (request, h) => {
        try {
          const rides = await Ride.query()
            .withGraphFetched("fromLocation")
            .withGraphFetched("toLocation")
            .withGraphFetched("drivers")
            .withGraphFetched("passengers")
            .withGraphFetched("vehicle");

          let ridesResponse = [];

          for (let ride of rides) {
            for (let driver of ride.drivers) {
              if (driver.id == request.params.id) {
                const formattedDate = ride.date.toLocaleDateString();

                ridesResponse.push({
                  id: ride.id,
                  from_location_id: ride.from_location_id,
                  to_location_id: ride.to_location_id,
                  fromLocation: ride.fromLocation.name,
                  toLocation: ride.toLocation.name,
                  drivers: ride.drivers,
                  passengers: ride.passengers,
                  capacity: ride.vehicle.capacity,
                  distance: `${ride.distance} m`,
                  date: formattedDate,
                  time: ride.time,
                  vehicle: `${ride.vehicle.color} ${ride.vehicle.make} ${ride.vehicle.model}`,
                  licensePlate: `${ride.vehicle.licenseState} ${ride.vehicle.licenseNumber}`,
                });
              }
            }
          }

          return ridesResponse;
        } catch (err) {
          console.log(err);
        }
      }
    },
    {
      method: "GET",
      path: "/rides/passenger/{id}",
      config: {
        description: "Retrieve all rides of specific passenger by id",
      },
      handler: async (request, h) => {
        try {
          const rides = await Ride.query()
            .withGraphFetched("fromLocation")
            .withGraphFetched("toLocation")
            .withGraphFetched("drivers")
            .withGraphFetched("passengers")
            .withGraphFetched("vehicle");

          let ridesResponse = [];

          for (let ride of rides) {
            for (let passenger of ride.passengers) {
              if (passenger.id == request.params.id) {
                const formattedDate = ride.date.toLocaleDateString();

                ridesResponse.push({
                  id: ride.id,
                  from_location_id: ride.from_location_id,
                  to_location_id: ride.to_location_id,
                  fromLocation: ride.fromLocation.name,
                  toLocation: ride.toLocation.name,
                  drivers: ride.drivers,
                  passengers: ride.passengers,
                  capacity: ride.vehicle.capacity,
                  distance: `${ride.distance} m`,
                  date: formattedDate,
                  time: ride.time,
                  vehicle: `${ride.vehicle.color} ${ride.vehicle.make} ${ride.vehicle.model}`,
                  licensePlate: `${ride.vehicle.licenseState} ${ride.vehicle.licenseNumber}`,
                });
              }
            }
          }

          return ridesResponse;
        } catch (err) {
          console.log(err);
        }
      }
    },
    {
      method: "POST",
      path: "/rides",
      config: {
        description: "Create a new ride",
        validate: {
          payload: Joi.object({
            fromLocation: Joi.string().required(),
            fromAddress: Joi.string().required(),
            fromCity: Joi.string().required(),
            fromState: Joi.string().required(),
            fromZipCode: Joi.string().required(),
            toLocation: Joi.string().required(),
            toAddress: Joi.string().required(),
            toCity: Joi.string().required(),
            toState: Joi.string().required(),
            toZipCode: Joi.string().required(),
            date: Joi.date().required(),
            time: Joi.string().required(),
            distance: Joi.number().min(1).required(),
            vehicleId: Joi.number().min(1).required()
          }),
        },
      },
      handler: async (request, h) => {
        try {

          const existingFromLocation = await Location.query()
            .where("name", request.payload.fromLocation)
            .where("address", request.payload.fromAddress)
            .where("city", request.payload.fromCity)
            .orWhere("city", request.payload.fromCity.toLowerCase())
            .first();
          
          const existingToLocation = await Location.query()
            .where("name", request.payload.toLocation)
            .where("address", request.payload.toAddress)
            .where("city", request.payload.toCity)
            .orWhere("city", request.payload.fromCity.toLowerCase())
            .first();

          if (!existingFromLocation) {
            const newFromLocation = await Location.query().insert({
              name: request.payload.fromLocation,
              address: request.payload.fromAddress,
              city: request.payload.fromCity,
              state: request.payload.fromState,
              zipCode: request.payload.fromZipCode,
            });
          }

          if (!existingToLocation) {
            const newToLocation = await Location.query().insert({
              name: request.payload.toLocation,
              address: request.payload.toAddress,
              city: request.payload.toCity,
              state: request.payload.toState,
              zipCode: request.payload.toZipCode,
            });
          }

          const fromLocationMatch = await Location.query()
            .select("id")
            .where("name", request.payload.fromLocation)
            .where("address", request.payload.fromAddress)
            .where("city", request.payload.fromCity)
            .first();
          
          const toLocationMatch = await Location.query()
            .select("id")
            .where("name", request.payload.toLocation)
            .where("address", request.payload.toAddress)
            .where("city", request.payload.toCity)
            .first();

          const newRide = await Ride.query().insert({
            date: request.payload.date,
            time: request.payload.time,
            distance: request.payload.distance,
            vehicle_id: request.payload.vehicleId,
            from_location_id: fromLocationMatch.id,
            to_location_id: toLocationMatch.id,
          });

          if (newRide) {
            return {
              ok: true,
              msge: `Created new ride from ${request.payload.fromLocation} to ${request.payload.toLocation}.`,
            };
          } else {
            return {
              ok: false,
              msge: `Couldn't create new ride from ${request.payload.fromLocation} to ${request.payload.toLocation}.`,
            };
          }

        } catch (err) {
          console.log(err);
        }
      }
    },
    {
      method: "PATCH",
      path: "/rides/{id}",
      config: {
        description: "Update a ride by id",
      },
      handler: async (request, h) => {
        try {
          let fromLocationPatches = {};
          if (request.payload.fromLocation != null && request.payload.fromLocation != "") {
            fromLocationPatches.name = request.payload.fromLocation;
          }
          if (request.payload.fromAddress != null && request.payload.fromAddress != "") {
            fromLocationPatches.address = request.payload.fromAddress;
          }
          if (request.payload.fromCity != null && request.payload.fromCity != "") {
            fromLocationPatches.city = request.payload.fromCity;
          }
          if (request.payload.fromState != null && request.payload.fromState != "") {
            fromLocationPatches.state = request.payload.fromState;
          }
          if (request.payload.fromZipCode != null && request.payload.fromZipCode != "") {
            fromLocationPatches.zipCode = request.payload.fromZipCode;
          }

          let toLocationPatches = {};
          if (request.payload.toLocation != null && request.payload.toLocation != "") {
            toLocationPatches.name = request.payload.toLocation;
          }
          if (request.payload.toAddress != null && request.payload.toAddress != "") {
            toLocationPatches.address = request.payload.toAddress;
          }
          if (request.payload.toCity != null && request.payload.toCity != "") {
            toLocationPatches.city = request.payload.toCity;
          }
          if (request.payload.toState != null && request.payload.toState != "") {
            toLocationPatches.state = request.payload.toState;
          }
          if (request.payload.toZipCode != null && request.payload.toZipCode != "") {
            toLocationPatches.zipCode = request.payload.toZipCode;
          }

          let ridePatches = {};
          if (request.payload.date != null && request.payload.date != "") {
            ridePatches.date = request.payload.date;
          }
          if (request.payload.time != null && request.payload.time != "") {
            ridePatches.time = request.payload.time;
          }
          if (request.payload.distance != null && request.payload.distance != "") {
            ridePatches.distance = request.payload.distance;
          }
          if (request.payload.vehicleId != null && request.payload.vehicleId != "") {
            ridePatches.vehicle_id = request.payload.vehicleId;
          }

          const fromLocationUpdated = await Location.query()
            .findById(request.payload.fromLocationId)
            .patch(fromLocationPatches);

          const toLocationUpdated = await Location.query()
            .findById(request.payload.toLocationId)
            .patch(toLocationPatches);
          
          const rideUpdated = await Ride.query()
            .findById(request.params.id)
            .patch(ridePatches);
          
          if (rideUpdated || fromLocationUpdated || toLocationUpdated) {
            return {
              ok: true,
              msge: `Updated ride!`,
            };
          } else {
            return {
              ok: false,
              msge: `No updates specified!`,
            };
          }

        } catch (err) {
          console.log(err);
        }
      }
    },
    {
      method: "GET",
      path: "/drivers",
      config: {
        description: "Retrieve all drivers",
      },
      handler: async (request, h) => {
        try {
          const drivers = await Driver.query();
          let driversResponse = [];
          
          for (let driver of drivers) {
            driversResponse.push({
              id: driver.id,
              firstName: driver.firstName,
              lastName: driver.lastName,
              phone: driver.phone,
              licenseNumber: driver.licenseNumber,
            });
          }
          return driversResponse;
        } catch (err) {
          console.log(err);
        }
      }
    },
    {
      method: "GET",
      path: "/authorized-drivers/{id}",
      config: {
        description: "Retrieve all authorized drivers for vehicle id",
      },
      handler: async (request, h) => {
        try {
          const vehicle = await Vehicle.query()
            .findById(request.params.id)
            .withGraphFetched("drivers")
          let authorizedDriversResponse = [];
          
          for (let driver of vehicle.drivers) {
            authorizedDriversResponse.push({
              id: driver.id,
              firstName: driver.firstName,
              lastName: driver.lastName,
              phone: driver.phone,
              licenseNumber: driver.licenseNumber,
            });
          }
          return authorizedDriversResponse;
        } catch (err) {
          console.log(err);
        }
      }
    },
    {
      method: "GET",
      path: "/authorized-rides/{id}",
      config: {
        description: "Retrieve all authorized rides for driver id",
      },
      handler: async (request, h) => {
        try {
          const driver = await Driver.query()
            .findById(request.params.id)
            .withGraphFetched("vehicles.rides.[fromLocation, toLocation, drivers, passengers]")

          let authorizedRidesResponse = [];
          for (let vehicle of driver.vehicles) {
            for (let ride of vehicle.rides) {
              const formattedDate = ride.date.toLocaleDateString();
              authorizedRidesResponse.push({
                id: ride.id,
                fromLocation: ride.fromLocation.name,
                toLocation: ride.toLocation.name,
                drivers: ride.drivers,
                passengers: ride.passengers,
                capacity: vehicle.capacity,
                distance: `${ride.distance} m`,
                date: formattedDate,
                time: ride.time,
                vehicle: `${vehicle.color} ${vehicle.make} ${vehicle.model}`,
                licensePlate: `${vehicle.licenseState} ${vehicle.licenseNumber}`,
              });
            }
          }
          return authorizedRidesResponse;
        } catch (err) {
          console.log(err);
        }
      }
    },
    {
      method: "POST",
      path: "/authorization",
      config: {
        description: "Authorizes a driver for a vehicle",
        validate: {
          payload: Joi.object({
            driverId: Joi.number().integer().min(1).required(),
            vehicleId: Joi.number().integer().min(1).required(),
          }),
        },
      },
      handler: async (request, h) => {
        try {
          const driver = await Driver.query().findById(request.payload.driverId);
          if (!driver) {
            return {
              ok: false,
              msge: "Selected driver not found in database for some whack reason."
            }
          }
          const vehicle = await Vehicle.query().findById(request.payload.vehicleId);
          if (!vehicle) {
            return {
              ok: false,
              msge: "Selected vehicle not found in database for some whack reason."
            }
          }

          const existingAuthorization = await driver
            .$relatedQuery("vehicles")
            .where("id", vehicle.id)
            .first();
          if (existingAuthorization) {
            return {
              ok: false,
              msge: "Driver already authorized for that vehicle",
            };
          }

          const affected = await driver.$relatedQuery("vehicles").relate(vehicle);

          if (affected === 1) {
            return {
              ok: true,
              msge: "Driver successfully authorized for vehicle",
            };
          } else {
            return {
              ok: false,
              msge: "Couldn't authorize driver for vehicle",
            };
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
    {
      method: "POST",
      path: "/driver-ride-join",
      config: {
        description: "Signs a driver up for a ride",
        validate: {
          payload: Joi.object({
            driverId: Joi.number().integer().min(1).required(),
            rideId: Joi.number().integer().min(1).required(),
          }),
        },
      },
      handler: async (request, h) => {
        try {
          const driver = await Driver.query().findById(request.payload.driverId);
          if (!driver) {
            return {
              ok: false,
              msge: "Selected driver not found in database for some whack reason."
            }
          }
          const ride = await Ride.query().findById(request.payload.rideId);
          if (!ride) {
            return {
              ok: false,
              msge: "Selected vehicle not found in database for some whack reason."
            }
          }

          const alreadyJoined = await driver
            .$relatedQuery("rides")
            .where("id", ride.id)
            .first();
          if (alreadyJoined) {
            return {
              ok: false,
              msge: "Driver already signed up for that ride",
            };
          }

          const affected = await driver.$relatedQuery("rides").relate(ride);

          if (affected === 1) {
            return {
              ok: true,
              msge: "Driver successfully signed up for that ride",
            };
          } else {
            return {
              ok: false,
              msge: "Couldn't sign up the driver for that ride",
            };
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
    {
      method: "POST",
      path: "/passenger-ride-join",
      config: {
        description: "Signs a passenger up for a ride",
        validate: {
          payload: Joi.object({
            passengerId: Joi.number().integer().min(1).required(),
            rideId: Joi.number().integer().min(1).required(),
          }),
        },
      },
      handler: async (request, h) => {
        try {
          const passenger = await Passenger.query().findById(request.payload.passengerId);
          if (!passenger) {
            return {
              ok: false,
              msge: "Selected driver not found in database for some whack reason."
            }
          }
          const ride = await Ride.query().findById(request.payload.rideId);
          if (!ride) {
            return {
              ok: false,
              msge: "Selected vehicle not found in database for some whack reason."
            }
          }

          const alreadyJoined = await passenger
            .$relatedQuery("rides")
            .where("id", ride.id)
            .first();
          if (alreadyJoined) {
            return {
              ok: false,
              msge: "Passenger already signed up for that ride",
            };
          }

          const affected = await passenger.$relatedQuery("rides").relate(ride);

          if (affected === 1) {
            return {
              ok: true,
              msge: "Passenger successfully signed up for that ride",
            };
          } else {
            return {
              ok: false,
              msge: "Couldn't sign up the passenger for that ride",
            };
          }
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