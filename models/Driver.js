const { Model } = require('objection');

class Driver extends Model {
  static get tableName() {
    return 'Driver';
  }
  static get relationMappings() {
    return {
      vehicles: {
        relation: Model.ManyToManyRelation,
        modelClass: __dirname + '/Vehicle',
        join: {
          from: 'Driver.id',
          through: {
            from: 'Authorization.driver_id',
            to: 'Authorization.vehicle_id'
          },
          to: 'Vehicle.id'
        }
      },
      rides: {
        relation: Model.ManyToManyRelation,
        modelClass: __dirname + '/Ride',
        join: {
          from: 'Driver.id',
          through: {
            from: 'Drivers.driver_id',
            to: 'Drivers.ride_id'
          },
          to: 'Ride.id'
        }
      }
    }
  }
}

module.exports = Driver;
