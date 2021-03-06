const { Model } = require('objection');

class Passenger extends Model {
  static get tableName() {
    return 'Passenger';
  }
  static get relationMappings() {
    return {
      rides: {
        relation: Model.ManyToManyRelation,
        modelClass: __dirname + '/Ride',
        join: {
          from: 'Passenger.id',
          through: {
            from: 'Passengers.passenger_id',
            to: 'Passengers.ride_id'
          },
          to: 'Ride.id'
        }
      }
    }
  }
}

module.exports = Passenger;
