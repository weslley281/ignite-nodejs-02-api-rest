import fastify from 'fastify';
import crypto from 'node:crypto';
import { knex } from './database';
import { env } from './env';
import { TransactionsRoutes } from './routes/transactions.routes';
import cookie from '@fastify/cookie';

const app = fastify();

app.register(cookie);
app.register(TransactionsRoutes, { prefix: 'transactions' });

app.listen({ port: env.PORT }).then(() => {
  console.log(`The server is running on http://localhost:${env.PORT}`);
});
