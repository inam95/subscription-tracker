import { Router } from 'express';

const authRouter = Router();

authRouter.post('/sign-up', (_req, res) => {
  res.send({ title: 'Sign Up' });
});

authRouter.post('/sign-in', (_req, res) => {
  res.send({ title: 'Sign In' });
});

authRouter.post('/sign-out', (_req, res) => {
  res.send({ title: 'Sign Out' });
});

export default authRouter;
