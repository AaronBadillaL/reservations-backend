import { Request, Response, NextFunction } from 'express';
import { ApiResponseHandler } from '../utils/apiResponse';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error('Error occurred:', err);

  // Si la respuesta ya fue enviada, no hacer nada
  if (res.headersSent) {
    return next(err);
  }

  // Manejar diferentes tipos de errores
  if (err.name === 'ValidationError') {
    ApiResponseHandler.validationError(res, err.message);
    return;
  }

  if (err.name === 'UnauthorizedError') {
    ApiResponseHandler.unauthorized(res, err.message);
    return;
  }

  if (err.name === 'ForbiddenError') {
    ApiResponseHandler.forbidden(res, err.message);
    return;
  }

  if (err.name === 'NotFoundError') {
    ApiResponseHandler.notFound(res, err.message);
    return;
  }

  // Para errores no manejados, usar error interno del servidor
  ApiResponseHandler.internalError(res, 'An unexpected error occurred');
};

// Middleware para manejar rutas no encontradas
export const notFoundHandler = (req: Request, res: Response): void => {
  ApiResponseHandler.notFound(res, `Route ${req.originalUrl} not found`);
};
