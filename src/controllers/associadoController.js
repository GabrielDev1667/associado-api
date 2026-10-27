/**
 * Camada de Controller
 * Responsável por receber a requisição, chamar o service e devolver a resposta
 */

const associadoService = require('../services/associadoService');
const AppError = require('../utils/AppError');

class AssociadoController {
  /**
   * GET /associados
   * Lista todos os associados ativos
   * Query param opcional: ?todos=true (lista também os inativos)
   */
  async listar(req, res, next) {
    try {
      const apenasAtivos = req.query.todos !== 'true';
      const associados = await associadoService.listarTodos(apenasAtivos);

      return res.status(200).json({
        sucesso: true,
        quantidade: associados.length,
        dados: associados
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /associados/:id
   */
  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;
      const associado = await associadoService.buscarPorId(id);

      return res.status(200).json({
        sucesso: true,
        dados: associado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /associados/cpf/:cpf
   * Endpoint específico de busca por CPF (pedido no enunciado)
   */
  async buscarPorCpf(req, res, next) {
    try {
      const { cpf } = req.params;
      const associado = await associadoService.buscarPorCpf(cpf);

      return res.status(200).json({
        sucesso: true,
        dados: associado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /associados
   * Body: { cpf_associado, nome_associado, email_associado }
   */
  async criar(req, res, next) {
    try {
      const dados = req.body;
      const novo = await associadoService.criar(dados);

      return res.status(201).json({
        sucesso: true,
        mensagem: 'Associado criado com sucesso',
        dados: novo
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /associados/:id
   * Body: campos a atualizar
   */
  async atualizar(req, res, next) {
    try {
      const { id } = req.params;
      const dados = req.body;

      const atualizado = await associadoService.atualizar(id, dados);

      return res.status(200).json({
        sucesso: true,
        mensagem: 'Associado atualizado com sucesso',
        dados: atualizado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /associados/:id
   * Query param: ?tipo=logica  (padrão)  ou  ?tipo=definitiva
   *
   * Regra de negócio: permite optar pela exclusão lógica ou definitiva
   */
  async excluir(req, res, next) {
    try {
      const { id } = req.params;
      const tipo = req.query.tipo || 'logica'; // padrão = lógica

      if (!['logica', 'definitiva', 'hard', 'soft'].includes(tipo)) {
        throw new AppError('Tipo de exclusão inválido. Use "logica" ou "definitiva"', 400);
      }

      const resultado = await associadoService.excluir(id, tipo);

      return res.status(200).json({
        sucesso: true,
        ...resultado
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AssociadoController();
