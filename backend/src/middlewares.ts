// src/middlewares.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from './dtos';

// Логування запитів у консоль (вимога методички)
export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
  });
  next();
};

// Централізована обробка помилок (вимога методички)
export const errorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Якщо помилка відома (керована) - повертаємо її у визначеному форматі
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: { code: err.code, message: err.message, details: err.details }
    });
  }
  
  // Якщо помилка невідома (неочікувана) - повертаємо 500
  console.error("Неочікувана помилка:", err);
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Внутрішня помилка сервера' } });
};