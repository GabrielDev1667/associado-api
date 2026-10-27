/**
 * Utilitários de validação
 */

/**
 * Valida se o CPF tem o formato básico (11 dígitos)
 * Não faz validação completa de dígitos verificadores para manter simples
 */
function validarCPF(cpf) {
  if (!cpf) return false;
  // Remove caracteres não numéricos
  const cpfLimpo = String(cpf).replace(/\D/g, '');
  return cpfLimpo.length === 11 && /^\d{11}$/.test(cpfLimpo);
}

/**
 * Valida e-mail simples
 */
function validarEmail(email) {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida os dados obrigatórios de um associado
 */
function validarAssociado(dados) {
  const erros = [];

  if (!dados.cpf_associado) {
    erros.push('cpf_associado é obrigatório');
  } else if (!validarCPF(dados.cpf_associado)) {
    erros.push('cpf_associado deve conter 11 dígitos numéricos');
  }

  if (!dados.nome_associado || String(dados.nome_associado).trim().length < 3) {
    erros.push('nome_associado é obrigatório e deve ter pelo menos 3 caracteres');
  }

  if (!dados.email_associado) {
    erros.push('email_associado é obrigatório');
  } else if (!validarEmail(dados.email_associado)) {
    erros.push('email_associado inválido');
  }

  return {
    valido: erros.length === 0,
    erros
  };
}

module.exports = {
  validarCPF,
  validarEmail,
  validarAssociado
};
