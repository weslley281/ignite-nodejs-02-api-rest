import fastify from 'fastify';

const app = fastify();

app.get('/hello', (req, res) => {
  return 'Olá mundo';
});

const port = 5000;
app.listen({ port: port }).then(() => {
  console.log(`The server is running on ${port}`);
});
