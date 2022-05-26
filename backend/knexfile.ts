import type { Knex } from 'knex';
import knexConfig from './src/config/knexConfig';

const config: { [key: string]: Knex.Config } = {
  development: knexConfig,

  production: {
    ...knexConfig,
    pool: {
      min: 2,
      max: 10,
    },
  },
};

module.exports = config;
