const { Model } = require('objection');

class Ride extends Model {
  static get tableName() {
    return 'Ride';
  }
  static get relationMappings() {
    return {
      drivers: {
        relation: Model.ManyToManyRelation,
        modelClass: __dirname + '/Driver',
        join: {
          from: 'Ride.id',
          through: {
            from: 'Drivers.ride_id',
            to: 'Drivers.driver_id'
          },
          to: 'Driver.id'
        }
      },
      passengers: {
        relation: Model.ManyToManyRelation,
        modelClass: __dirname + '/Passenger',
        join: {
          from: 'Ride.id',
          through: {
            from: 'Passengers.ride_id',
            to: 'Passengers.passenger_id'
          },
          to: 'Passenger.id'
        }
      },
      vehicle: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + '/Vehicle',
        join: {
          from: 'Ride.vehicle_id',
          to: 'Vehicle.id'
        }
      },
      fromLocation: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + '/Location',
        join: {
          from: 'Ride.from_location_id',
          to: 'Location.id'
        }
      },
      toLocation: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + '/Location',
        join: {
          from: 'Ride.to_location_id',
          to: 'Location.id'
        }
      },
    } 
  }
}

module.exports = Ride;
