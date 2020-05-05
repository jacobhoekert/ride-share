const { Model } = require('objection');

class Location extends Model {
  static get tableName() {
    return 'Location';
  }
  static get relationMappings() {
    return {
      fromLocations: {
        relation: Model.HasManyRelation,
        modelClass: __dirname + '/Ride',
        join: {
          from: 'Location.id',
          to: 'Ride.from_location_id'
        }
      },
      toLocations: {
        relation: Model.HasManyRelation,
        modelClass: __dirname + '/Ride',
        join: {
          from: 'Location.id',
          to: 'Ride.to_location_id'
        }
      }
    }
  }
}

module.exports = Location;
