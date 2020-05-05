const { Model } = require('objection');

class VehicleType extends Model {
  static get tableName() {
    return 'VehicleType';
  }
  static get relationMappings() {
    return {
      vehicles: {
        relation: Model.HasManyRelation,
        modelClass: __dirname + '/Vehicle',
        join: {
          from: 'VehicleType.id',
          to: 'Vehicle.from_vehicle_type_id'
        }
      },
    }
  }
}

module.exports = VehicleType;
