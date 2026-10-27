/**
 * Ponto de entrada da aplicação
 */

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`  API de Associados rodando na porta ${PORT}`);
  console.log(`  http://localhost:${PORT}`);
  console.log(`========================================`);
});
