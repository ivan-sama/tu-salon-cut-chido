import knex from 'knex';
import knexConfig from './config/knexConfig';

const db = knex(knexConfig);

export default db;
