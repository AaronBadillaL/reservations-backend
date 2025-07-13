import { Response } from 'express';

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
}

export class ApiResponseHandler {
  /**
   * Envía una respuesta exitosa
   */
  static success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200,
  ): void {
    const response: ApiResponse<T> = {
      status: 'success',
      message,
      data,
    };

    res.status(statusCode).json(response);
  }

  /**
   * Envía una respuesta de error
   */
  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
  ): void {
    const response: ApiResponse = {
      status: 'error',
      message,
    };

    res.status(statusCode).json(response);
  }

  /**
   * Envía una respuesta exitosa con datos de creación
   */
  static created<T>(
    res: Response,
    message: string,
    data?: T,
  ): void {
    ApiResponseHandler.success(res, message, data, 201);
  }

  /**
   * Envía una respuesta de error de validación
   */
  static validationError(
    res: Response,
    message: string = 'Validation failed',
  ): void {
    ApiResponseHandler.error(res, message, 400);
  }

  /**
   * Envía una respuesta de error de autenticación
   */
  static unauthorized(
    res: Response,
    message: string = 'Authentication required',
  ): void {
    ApiResponseHandler.error(res, message, 401);
  }

  /**
   * Envía una respuesta de error de autorización
   */
  static forbidden(
    res: Response,
    message: string = 'Insufficient permissions',
  ): void {
    ApiResponseHandler.error(res, message, 403);
  }

  /**
   * Envía una respuesta de error de recurso no encontrado
   */
  static notFound(
    res: Response,
    message: string = 'Resource not found',
  ): void {
    ApiResponseHandler.error(res, message, 404);
  }

  /**
   * Envía una respuesta de error interno del servidor
   */
  static internalError(
    res: Response,
    message: string = 'Internal server error',
  ): void {
    ApiResponseHandler.error(res, message, 500);
  }

}
