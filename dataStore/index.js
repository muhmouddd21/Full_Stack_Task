const knex = require('knex');
const knexfile = require('./knexfile');

// Default to "development" if NODE_ENV is not set
const environment = process.env.NODE_ENV || 'development';
const config = knexfile[environment];

const db = knex(config);

module.exports = db;