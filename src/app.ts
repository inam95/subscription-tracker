import express, { Request, Response } from 'express';

import { env } from './config/env';
import authRouter from './routes/auth.route';
import subscriptionRouter from './routes/subscription.route';
import userRouter from './routes/user.route';
import connectToDatabase from './database/mongodb';

const app = express();
const port = env.PORT;

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to the Subscription Tracker API!');
});

app.listen(port, async () => {
  console.log(`Server started at http://localhost:${port}`);

  // Connect to the database
  await connectToDatabase();
});

export default app;
