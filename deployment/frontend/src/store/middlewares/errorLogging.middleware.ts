import { type Middleware } from '@reduxjs/toolkit';

/**
 * Log a warning and show toast!
 */
export const errorLoggingMiddleware: Middleware = () => next => action => {
  return next(action);
};
