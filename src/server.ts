import fastify from 'fastify';
import { knex } from './database';

const app = fastify();

app.get('/', async (req, res) => {
  const tables = await knex('sqlite_schema').select('*');
  return tables;
});

const port = 5000;
app.listen({ port: port }).then(() => {
  console.log(`The server is running on http://localhost:${port}`);
});
