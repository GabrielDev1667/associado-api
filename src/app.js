/**
 * Configuração da aplicação Express
 */

const express = require('express');
const associadoRoutes = require('./routes/associadoRoutes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

// Middlewares globais
app.use(express.json()); // parse JSON do body
app.use(express.urlencoded({ extended: true }));

// Rota de health check
app.get('/', (req, res) => {
  res.json({
    mensagem: 'API de Associados de Clube - Server-Side',
    versao: '1.0.0',
    endpoints: {
      'GET /associados': 'Lista todos os associados ativos',
      'GET /associados?todos=true': 'Lista todos (incluindo inativos)',
      'GET /associados/:id': 'Busca por ID',
      'GET /associados/cpf/:cpf': 'Busca por CPF',
      'POST /associados': 'Cria um novo associado',
      'PUT /associados/:id': 'Atualiza um associado',
      'DELETE /associados/:id?tipo=logica': 'Exclusão lógica (padrão)',
      'DELETE /associados/:id?tipo=definitiva': 'Exclusão definitiva'
    }
  });
});

// Rotas da API
app.use('/associados', associadoRoutes);

// 404
app.use(notFoundHandler);

// Tratamento global de erros (deve ser o último)
app.use(errorHandler);

module.exports = app;
