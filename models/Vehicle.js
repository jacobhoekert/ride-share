const { Model } = require('objection');

class Vehicle extends Model {
  static get tableName() {
    return 'Vehicle';
  }
  static get relationMappings() {
    return {
      drivers: {
        relation: Model.ManyToManyRelation,
        modelClass: __dirname + '/Driver',
        join: {
          from: 'Vehicle.id',
          through: {
            from: 'Authorization.vehicle_id',
            to: 'Authorization.driver_id'
          },
          to: 'Driver.id'
        }
      },
      vehicleType: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + '/VehicleType',
        join: {
          from: 'Vehicle.vehicle_type_id',
          to: 'VehicleType.id'
        }
      },
      rides: {
        relation: Model.HasManyRelation,
        modelClass: __dirname + '/Ride',
        join: {
          from: 'Vehicle.id',
          to: 'Ride.vehicle_id'
        }
      }
    } 
  }
}

module.exports = Vehicle;
