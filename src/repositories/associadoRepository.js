/**
 * Camada de Repositório (acesso a dados)
 * Responsável por todas as operações de leitura/escrita no "banco"
 */

const { associados } = require('../config/database');

// Gerador simples de ID (evita dependência externa)
let contadorId = 1;
function gerarId() {
  return `assoc-${Date.now()}-${contadorId++}`;
}

class AssociadoRepository {
  /**
   * Lista todos os associados (ativos ou todos)
   * @param {boolean} apenasAtivos - se true, retorna só os não excluídos logicamente
   */
  async findAll(apenasAtivos = true) {
    return new Promise((resolve) => {
      // Simula assincronismo (como se fosse uma query ao banco)
      setTimeout(() => {
        if (apenasAtivos) {
          resolve(associados.filter(a => a.ativo === true));
        } else {
          resolve([...associados]);
        }
      }, 10);
    });
  }

  /**
   * Busca associado por ID interno
   */
  async findById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const associado = associados.find(a => a.id === id);
        resolve(associado || null);
      }, 10);
    });
  }

  /**
   * Busca associado por CPF
   */
  async findByCpf(cpf) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cpfLimpo = String(cpf).replace(/\D/g, '');
        const associado = associados.find(
          a => a.cpf_associado === cpfLimpo
        );
        resolve(associado || null);
      }, 10);
    });
  }

  /**
   * Cria um novo associado
   */
  async create(dados) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const novoAssociado = {
          id: gerarId(),
          cpf_associado: String(dados.cpf_associado).replace(/\D/g, ''),
          nome_associado: dados.nome_associado.trim(),
          email_associado: dados.email_associado.trim().toLowerCase(),
          ativo: true, // começa ativo
          data_criacao: new Date().toISOString(),
          data_atualizacao: new Date().toISOString()
        };

        associados.push(novoAssociado);
        resolve(novoAssociado);
      }, 10);
    });
  }

  /**
   * Atualiza um associado existente
   */
  async update(id, dados) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = associados.findIndex(a => a.id === id);
        if (index === -1) {
          resolve(null);
          return;
        }

        const atualizado = {
          ...associados[index],
          ...dados,
          data_atualizacao: new Date().toISOString()
        };

        // Garante que o CPF fique só com números se for atualizado
        if (dados.cpf_associado) {
          atualizado.cpf_associado = String(dados.cpf_associado).replace(/\D/g, '');
        }

        associados[index] = atualizado;
        resolve(atualizado);
      }, 10);
    });
  }

  /**
   * Exclusão lógica (soft delete)
   */
  async softDelete(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = associados.findIndex(a => a.id === id);
        if (index === -1) {
          resolve(null);
          return;
        }

        associados[index].ativo = false;
        associados[index].data_atualizacao = new Date().toISOString();
        associados[index].data_exclusao = new Date().toISOString();

        resolve(associados[index]);
      }, 10);
    });
  }

  /**
   * Exclusão definitiva (hard delete)
   */
  async hardDelete(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = associados.findIndex(a => a.id === id);
        if (index === -1) {
          resolve(null);
          return;
        }

        const removido = associados.splice(index, 1)[0];
        resolve(removido);
      }, 10);
    });
  }
}

module.exports = new AssociadoRepository();
