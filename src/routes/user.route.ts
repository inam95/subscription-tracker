import { Router } from 'express';

const userRouter = Router();

userRouter.get('/', (_req, res) => {
  res.send({ title: 'GET all users' });
});

userRouter.get('/:id', (_req, res) => {
  res.send({ title: 'GET users details' });
});

userRouter.post('/', (_req, res) => {
  res.send({ title: 'CREATE new user' });
});

userRouter.put('/:id', (_req, res) => {
  res.send({ title: 'UPDATE user' });
});

userRouter.delete('/:id', (_req, res) => {
  res.send({ title: 'DELETE user' });
});

export default userRouter;
