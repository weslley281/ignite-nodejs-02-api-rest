import { FastifyInstance } from 'fastify';
import { knex } from '../database';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';

export async function TransactionsRoutes(app: FastifyInstance) {
  app.get('/', async (request, response) => {
    const transactions = await knex('transactions').select('*');

    return transactions;
  });

  app.get('/:id', async (request, response) => {
    const getTransactionsParamanSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getTransactionsParamanSchema.parse(request.params);

    const transaction = await knex('transactions').where('id', id).first();

    return transaction;
  });

  app.get('/sumary', async (request, response) => {
    const sumary = await knex('transactions')
      .sum('amount', { as: 'amount' })
      .first();

    return sumary;
  });

  app.post('/', async (request, response) => {
    const createransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    });

    const { title, amount, type } = createransactionBodySchema.parse(
      request.body
    );

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      response.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    });

    return response.status(201).send({ response: 'Transaction Created' });
  });
}
