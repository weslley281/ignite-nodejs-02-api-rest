import { FastifyInstance } from 'fastify';
import { knex } from '../database';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { checkSessionIdExists } from '../middlewares/check-session-id-exists';

export async function TransactionsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, response) => {
      const { sessionId } = request.cookies;

      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select('*');

      return transactions;
    }
  );

  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, response) => {
      const getTransactionsParamanSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getTransactionsParamanSchema.parse(request.params);
      const { sessionId } = request.cookies;

      const transaction = await knex('transactions')
        .where({ id, session_id: sessionId })
        .first();

      return transaction;
    }
  );

  app.get(
    '/sumary',
    { preHandler: [checkSessionIdExists] },
    async (request, response) => {
      const { sessionId } = request.cookies;

      const sumary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first();

      return sumary;
    }
  );

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
