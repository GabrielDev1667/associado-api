/**
 * Camada de Serviço (regras de negócio)
 * Contém a lógica de negócio e orquestra o repositório
 */

const associadoRepository = require('../repositories/associadoRepository');
const { validarAssociado } = require('../utils/validators');
const AppError = require('../utils/AppError');

class AssociadoService {
  /**
   * Lista todos os associados ativos
   */
  async listarTodos(apenasAtivos = true) {
    try {
      const associados = await associadoRepository.findAll(apenasAtivos);
      return associados;
    } catch (error) {
      throw new AppError('Erro ao listar associados', 500);
    }
  }

  /**
   * Busca por ID
   */
  async buscarPorId(id) {
    if (!id) {
      throw new AppError('ID é obrigatório', 400);
    }

    const associado = await associadoRepository.findById(id);

    if (!associado) {
      throw new AppError('Associado não encontrado', 404);
    }

    return associado;
  }

  /**
   * Busca por CPF (endpoint específico pedido no enunciado)
   */
  async buscarPorCpf(cpf) {
    if (!cpf) {
      throw new AppError('CPF é obrigatório', 400);
    }

    const associado = await associadoRepository.findByCpf(cpf);

    if (!associado) {
      throw new AppError('Associado não encontrado com este CPF', 404);
    }

    return associado;
  }

  /**
   * Cria um novo associado
   */
  async criar(dados) {
    // Validação de entrada
    const { valido, erros } = validarAssociado(dados);
    if (!valido) {
      throw new AppError(`Dados inválidos: ${erros.join('; ')}`, 400);
    }

    // Regra de negócio: CPF não pode ser duplicado
    const existente = await associadoRepository.findByCpf(dados.cpf_associado);
    if (existente) {
      throw new AppError('Já existe um associado cadastrado com este CPF', 409);
    }

    try {
      const novo = await associadoRepository.create(dados);
      return novo;
    } catch (error) {
      throw new AppError('Erro ao criar associado', 500);
    }
  }

  /**
   * Atualiza um associado
   */
  async atualizar(id, dados) {
    // Verifica se existe
    const associadoAtual = await this.buscarPorId(id);

    // Se estiver tentando alterar o CPF, valida se não existe outro com o mesmo
    if (dados.cpf_associado) {
      const cpfLimpo = String(dados.cpf_associado).replace(/\D/g, '');
      if (cpfLimpo !== associadoAtual.cpf_associado) {
        const existente = await associadoRepository.findByCpf(cpfLimpo);
        if (existente) {
          throw new AppError('Já existe outro associado com este CPF', 409);
        }
      }
    }

    // Validação parcial (só valida os campos que vieram)
    if (dados.nome_associado !== undefined && String(dados.nome_associado).trim().length < 3) {
      throw new AppError('nome_associado deve ter pelo menos 3 caracteres', 400);
    }

    if (dados.email_associado !== undefined) {
      const { validarEmail } = require('../utils/validators');
      if (!validarEmail(dados.email_associado)) {
        throw new AppError('email_associado inválido', 400);
      }
    }

    try {
      const atualizado = await associadoRepository.update(id, dados);
      return atualizado;
    } catch (error) {
      throw new AppError('Erro ao atualizar associado', 500);
    }
  }

  /**
   * Exclusão com opção de lógica ou definitiva
   *
   * @param {string} id - ID do associado
   * @param {string} tipo - 'logica' (padrão) ou 'definitiva'
   */
  async excluir(id, tipo = 'logica') {
    // Verifica se existe
    const associado = await this.buscarPorId(id);

    if (tipo === 'definitiva' || tipo === 'hard') {
      // Exclusão definitiva (remove do "banco")
      const removido = await associadoRepository.hardDelete(id);
      return {
        mensagem: 'Associado excluído definitivamente',
        tipo: 'definitiva',
        associado: removido
      };
    }

    // Por padrão: exclusão lógica (soft delete)
    if (associado.ativo === false) {
      throw new AppError('Associado já está inativo (exclusão lógica já realizada)', 400);
    }

    const inativado = await associadoRepository.softDelete(id);
    return {
      mensagem: 'Associado excluído logicamente (inativado)',
      tipo: 'logica',
      associado: inativado
    };
  }
}

module.exports = new AssociadoService();
