/**
 * Rotas da API de Associados
 */

const express = require('express');
const router = express.Router();
const associadoController = require('../controllers/associadoController');

// Importante: a rota de CPF deve vir ANTES da rota /:id
// para não ser interpretada como um ID

// GET /associados - listar todos
router.get('/', (req, res, next) => associadoController.listar(req, res, next));

// GET /associados/cpf/:cpf - busca por CPF (endpoint específico)
router.get('/cpf/:cpf', (req, res, next) => associadoController.buscarPorCpf(req, res, next));

// GET /associados/:id - busca por ID
router.get('/:id', (req, res, next) => associadoController.buscarPorId(req, res, next));

// POST /associados - criar
router.post('/', (req, res, next) => associadoController.criar(req, res, next));

// PUT /associados/:id - atualizar
router.put('/:id', (req, res, next) => associadoController.atualizar(req, res, next));

// DELETE /associados/:id?tipo=logica|definitiva - excluir
router.delete('/:id', (req, res, next) => associadoController.excluir(req, res, next));

module.exports = router;
