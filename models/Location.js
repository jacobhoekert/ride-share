const { Model } = require('objection');

class Location extends Model {
  static get tableName() {
    return 'Location';
  }
  static get relationMappings() {
    return {
      fromLocation: {
        relation: Model.HasManyRelation,
        modelClass: __dirname + '/Ride',
        join: {
          from: 'Location.id',
          to: 'Ride.from_location_id'
        }
      },
      toLocation: {
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
