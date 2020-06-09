import knex from 'knex';
const configKnex = require('../../knexfile');
// import configKnex from '../../knexfile';

const connection = knex(configKnex.development);

export default connection;