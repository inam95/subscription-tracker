import { Router } from 'express';

const subscriptionRouter = Router();

subscriptionRouter.get('/', (_req, res) => {
  res.send({ title: 'GET all subscriptions' });
});

subscriptionRouter.get('/:id', (_req, res) => {
  res.send({ title: 'GET subscription details' });
});

subscriptionRouter.post('/', (_req, res) => {
  res.send({ title: 'CREATE new subscription' });
});

subscriptionRouter.put('/:id', (_req, res) => {
  res.send({ title: 'UPDATE subscription' });
});

subscriptionRouter.delete('/:id', (_req, res) => {
  res.send({ title: 'DELETE subscription' });
});

subscriptionRouter.get('/user/:id', (_req, res) => {
  res.send({ title: 'GET all subscriptions for a user' });
});

subscriptionRouter.put('/:id/cancel', (_req, res) => {
  res.send({ title: 'Cancel subscription' });
});

subscriptionRouter.get('/upcoming-renewals', (_req, res) => {
  res.send({ title: 'GET upcoming renewals' });
});

export default subscriptionRouter;
