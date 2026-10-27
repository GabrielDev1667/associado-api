/**
 * Middleware global de tratamento de exceções
 */

const AppError = require('../utils/AppError');

function errorHandler(err, req, res, next) {
  // Se for um erro operacional da aplicação (AppError)
  if (err instanceof AppError || err.isOperational) {
    return res.status(err.statusCode || 400).json({
      sucesso: false,
      erro: err.message
    });
  }

  // Erros inesperados (bugs, etc.)
  console.error('[ERRO NÃO TRATADO]', err);

  return res.status(500).json({
    sucesso: false,
    erro: 'Erro interno do servidor'
  });
}

/**
 * Middleware para rotas não encontradas
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    sucesso: false,
    erro: `Rota não encontrada: ${req.method} ${req.originalUrl}`
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};
