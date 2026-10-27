/**
 * Classe customizada de erro para tratamento padronizado de exceções
 */
class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Erros esperados da aplicação
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
