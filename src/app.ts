import 'express-async-errors';
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';

import { env } from './config/env';
import authRouter from './routes/auth.route';
import subscriptionRouter from './routes/subscription.route';
import userRouter from './routes/user.route';
import connectToDatabase from './database/mongodb';
import errorMiddleware from './middlewares/error.middleware';
import { NotFoundError } from './utils/errors';

const port = env.PORT;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to the Subscription Tracker API!');
});

app.all('*', (req, _res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

app.use(errorMiddleware);

app.listen(port, async () => {
  console.log(`Server started at http://localhost:${port}`);

  // Connect to the database
  await connectToDatabase();
});

export default app;
