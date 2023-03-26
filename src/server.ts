import fastify from 'fastify';
import crypto from 'node:crypto';
import { knex } from './database';

const app = fastify();

app.get('/', async (req, res) => {
  // const transactions = await knex('transactions')
  //   .insert({
  //     id: crypto.randomUUID(),
  //     title: 'Transação de teste',
  //     amount: 1800,
  //   })
  //   .returning('*');
  const transactions = await knex('transactions').select('*');

  return transactions;
});

const port = 5000;
app.listen({ port: port }).then(() => {
  console.log(`The server is running on http://localhost:${port}`);
});
