# API de Associados de Clube

API REST em Node.js para manipulação de associados de um clube.

## Requisitos atendidos

- CRUD completo (Create, Read, Update, Delete)
- Endpoint específico de busca por `cpf_associado`
- Organização em camadas/módulos (Controller → Service → Repository)
- Uso de assincronismo (async/await + Promises)
- Tratamento de exceções centralizado
- Regra de negócio: exclusão lógica **ou** definitiva

## Estrutura do projeto

```
associado-api/
├── src/
│   ├── config/
│   │   └── database.js          # "Banco" em memória
│   ├── controllers/
│   │   └── associadoController.js
│   ├── middlewares/
│   │   └── errorHandler.js
│   ├── repositories/
│   │   └── associadoRepository.js
│   ├── routes/
│   │   └── associadoRoutes.js
│   ├── services/
│   │   └── associadoService.js
│   ├── utils/
│   │   ├── AppError.js
│   │   └── validators.js
│   ├── app.js                   # Configuração do Express
│   └── server.js                # Ponto de entrada
├── package.json
└── README.md
```

## Como rodar

```bash
# Instalar dependências
npm install

# Iniciar o servidor
npm start

# Ou em modo desenvolvimento (com nodemon)
npm run dev
```

A API estará disponível em: `http://localhost:3000`

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/associados` | Lista associados ativos |
| GET | `/associados?todos=true` | Lista todos (ativos + inativos) |
| GET | `/associados/:id` | Busca por ID |
| GET | `/associados/cpf/:cpf` | **Busca por CPF** |
| POST | `/associados` | Cria associado |
| PUT | `/associados/:id` | Atualiza associado |
| DELETE | `/associados/:id?tipo=logica` | Exclusão lógica (padrão) |
| DELETE | `/associados/:id?tipo=definitiva` | Exclusão definitiva |

## Como testar a API

### Opção recomendada: Postman

A forma mais fácil e visual de testar é usando o **[Postman](https://www.postman.com/downloads/)**.

#### Collection pronta (já configurada)

A collection do Postman está disponível no link abaixo:

[Clique aqui para baixar a Collection do Postman
](https://drive.google.com/file/d/1UGdGdpyC3Tgk3X3-sC8krHaa8iRJlNAK/view?usp=sharing)

**Como importar no Postman:**

1. Abra o Postman
2. Clique em **Import** (canto superior esquerdo)
3. Arraste o arquivo `Associados_API.postman_collection.json` ou clique em **Upload Files**
4. Clique em **Import**

Pronto — vão aparecer 11 requests já configuradas (criar, listar, buscar por CPF, atualizar, exclusões e testes de erro).

**Importante:** nas requests **5 (Buscar por ID)**, **6 (Atualizar)**, **7 (Exclusão Lógica)** e **8 (Exclusão Definitiva)** existe o texto `COLE_O_ID_AQUI`.

1. Execute primeiro a request **1. Criar Associado**
2. Copie o valor do campo `id` que veio na resposta
3. Substitua `COLE_O_ID_AQUI` pelo id copiado nas requests 5, 6, 7 e 8

#### Criar requests manualmente (opcional)

1. Baixe e instale o Postman
2. Crie uma nova request
3. Escolha o método (GET, POST, PUT, DELETE)
4. Cole a URL (ex: `http://localhost:3000/associados`)
5. Em requests POST/PUT, vá na aba **Body** → **raw** → **JSON** e cole o corpo
6. Clique em **Send**

Exemplo de body para criar associado:
```json
{
  "cpf_associado": "12345678901",
  "nome_associado": "João da Silva",
  "email_associado": "joao@email.com"
}
```

### Opção alternativa: cURL (terminal)

> **Importante:** os exemplos abaixo usam sintaxe de terminal **Bash**.
> - No **Linux** e **macOS** funciona direto.
> - No **Windows**, use o **Git Bash** (instalado junto com o Git) ou o WSL.
> - No PowerShell/CMD os comandos com `\` no final da linha **não funcionam**.

### Criar associado
```bash
curl -X POST http://localhost:3000/associados \
  -H "Content-Type: application/json" \
  -d '{
    "cpf_associado": "12345678901",
    "nome_associado": "João da Silva",
    "email_associado": "joao@email.com"
  }'
```

### Listar
```bash
curl http://localhost:3000/associados
```

### Buscar por CPF
```bash
curl http://localhost:3000/associados/cpf/12345678901
```

### Atualizar
```bash
curl -X PUT http://localhost:3000/associados/{ID} \
  -H "Content-Type: application/json" \
  -d '{
    "nome_associado": "João Silva Atualizado"
  }'
```

### Exclusão lógica (padrão)
```bash
curl -X DELETE "http://localhost:3000/associados/{ID}?tipo=logica"
```

### Exclusão definitiva
```bash
curl -X DELETE "http://localhost:3000/associados/{ID}?tipo=definitiva"
```

## Campos do associado

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string (UUID) | Identificador interno |
| `cpf_associado` | string | CPF (11 dígitos) |
| `nome_associado` | string | Nome completo |
| `email_associado` | string | E-mail |
| `ativo` | boolean | `true` = ativo, `false` = exclusão lógica |
| `data_criacao` | string (ISO) | Data de criação |
| `data_atualizacao` | string (ISO) | Última atualização |
| `data_exclusao` | string (ISO) | Preenchido apenas na exclusão lógica |
