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







