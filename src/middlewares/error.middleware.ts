import { ErrorRequestHandler, Request, Response } from 'express';
import { env } from '../config/env';

interface MongoError extends Error {
  code?: number;
  keyPattern?: Record<string, number>;
  keyValue?: Record<string, unknown>;
}

interface MongoValidationError extends Error {
  errors: Record<string, { message: string; path?: string; value?: unknown }>;
}

interface CustomError extends Error {
  statusCode?: number;
  errors?: Record<string, ErrorDetail>;
  isOperational?: boolean;
}

interface ErrorDetail {
  message: string;
  field?: string;
  value?: unknown;
}

const errorMiddleware: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
) => {
  const logError = (error: CustomError, isOperational = true) => {
    console.error(
      JSON.stringify({
        message: error.message,
        stack: error.stack,
        isOperational,
        path: req.path,
        method: req.method,
        timeStamp: new Date().toISOString(),
      }),
    );
  };

  let error: CustomError = Object.create(err);
  error.message = err.message || 'Something went wrong';

  if (err.name === 'CastError') {
    error = new Error('Resource not found') as CustomError;
    error.statusCode = 404;
    error.isOperational = true;
  } else if ((err as MongoError).code === 11000) {
    error = new Error('Duplicate field value entered') as CustomError;
    error.statusCode = 400;
    error.isOperational = true;
  } else if (err.name === 'ValidationError') {
    const mongoError = err as MongoValidationError;
    const messages = Object.values(mongoError.errors || {}).map(
      (val) => val.message,
    );
    error = new Error(messages.join('. ')) as CustomError;
    error.statusCode = 400;
    error.isOperational = true;
  }

  const isOperational =
    error.isOperational !== undefined
      ? error.isOperational
      : error.statusCode !== undefined && error.statusCode < 500;

  logError(error, isOperational);

  if (!isOperational && env.NODE_ENV === 'production') {
    // Send alert to the monitoring service
  }

  const statusCode = error.statusCode || 500;

  const responsePayload: Record<string, unknown> = {
    success: false,
    message: error.message || 'Server Error',
    status: statusCode,
  };

  if (env.NODE_ENV === 'development') {
    responsePayload.stack = error.stack;
  }

  res.status(statusCode).json(responsePayload);
};

export default errorMiddleware;
