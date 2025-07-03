# Projeto Aiqfome - Api de Gerenciamento de Favoritos

## Descrição
Este projeto implementa um serviço de gerenciamento de clientes e seus produtos favoritos seguindo os princípios de Clean Architecture, SOLID e boas práticas de desenvolvimento. O sistema inclui:

- API REST para operações CRUD de clientes e produtos favoritos.
- Containerização com Docker

### Boas Práticas Implementadas
Separação clara entre domínio, aplicação e infraestrutura, considerando os princípios da Clean Architecture.
- Tratamento de Erros: Middleware centralizado para tratamento de erros

## Estrutura do Projeto
- domain: Domínio e regras de negócio
- infrastructure: infraestrutura e implementação de adaptadores
- application: camada de aplicação, contendo regras de negócios e serviços
- presentation: rotas e controladores http

## Requisitos
- Node.js 22+
- Docker e Docker Compose
- PostgreSQL

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/leonardodecuritiba/aiqfome-api
cd aiqfome-api
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. Inicie os serviços com Docker:
```bash
docker-compose up -d
```

## Estrutura de Testes
- integration: Testes de integração
- use-cases: Testes de unidade

## Desenvolvimento
Para iniciar o banco de dados execute (criar as tabelas):
```bash
yarn ts-node setup-db.ts
```
Para iniciar o servidor em modo desenvolvimento:
```bash
yarn dev
```
Para mostrar erros
```bash
yarn lint
```
Para corrigir automaticamente
```bash
yarn lint:fix
```
Para formata o código
```bash
yarn format
```

## Testes

Para executar os testes:
```bash
yarn test
```
---
## Como Rodar a Aplicação com Docker Compose

Siga os passos abaixo para subir a aplicação e o banco de dados usando Docker Compose:

1.  **Construa e Inicie os Serviços:**
    O Docker Compose irá construir a imagem da API (se necessário) e iniciar os containers da API e do banco de dados.
    ```bash
    docker-compose up --build
    ```
    - O `--build` garante que a imagem da API seja reconstruída, incorporando as últimas alterações.
    - Na primeira vez, pode demorar um pouco para baixar as imagens base e construir a imagem da API.

2.  **Verifique os Containers:**
    Você pode verificar o status dos containers em execução:
    ```bash
    docker-compose ps
    ```

3.  **Acesse a API:**
    A API estará disponível em `http://localhost:3000`.

5.  **Parar os Serviços:**
    Para parar e remover os containers (e a rede padrão criada pelo Docker Compose):
    ```bash
    docker-compose down
    ```

---

## Variáveis de Ambiente

As variáveis de ambiente para a conexão com o banco de dados são gerenciadas através do arquivo `.env` na raiz do projeto. Este arquivo é carregado automaticamente pelo Docker Compose para os serviços `api` e `db`.

**Exemplo de `.env`:**

```dotenv
APP_PORT=3000
NODE_ENV=production
LOG_LEVEL=debug
FAKE_API=https://fakestoreapi.com

DB_PORT=5433
DB_HOST=localhost
DB_USER=user
DB_PASSWORD=password
DB_NAME=favorites
```

---

## Considerações 

- **Persistência de Dados:** O volume `postgres_data` garante que os dados do PostgreSQL persistam mesmo se o container do banco de dados for removido e recriado (a menos que você use `docker-compose down -v`).
- **Ambiente de Desenvolvimento:** Para desenvolvimento local sem Docker, a aplicação continuará usando o repositório em memória, a menos que a variável de ambiente `NODE_ENV` seja definida como `production`.

# Documentação da API Aiqfome

Esta documentação descreve como interagir com a API de Aiqfome. A API permite que os usuários gerenciem listas de produtos favoritos.

---

## Autenticação

A maioria das rotas nesta API é protegida e requer uma chave de API para autenticação.

- **Tipo de Autenticação**: Chave de API
- **Cabeçalho**: `x-api-key`

Você recebe sua chave de API (`apiKey`) ao criar um novo cliente.

---

## Endpoints

### 1. Clientes

#### **`POST /clients`**

Cria um novo cliente no sistema.

- **Autenticação**: Nenhuma

**Corpo da Requisição (Request Body):** `application/json`

| Campo   | Tipo   | Descrição                  |
|---------|--------|----------------------------|
| `name`  | string | Nome do cliente.           |
| `email` | string | Endereço de e-mail único.  |

**Exemplo de Requisição:**

```bash
curl -X POST \
  http://localhost:3000/clients \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Leonardo Zanin",
    "email": "leo.zanin@example.com"
}'
```

**Resposta de Sucesso (Success Response):** `201 Created`

Retorna o objeto do cliente recém-criado, incluindo seu `id` e a `apiKey` para autenticação futura.

```json
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "name": "Leonardo Zanin",
  "email": "leo.zanin@example.com",
  "favorites": [],
  "apiKey": "fedcba09-8765-4321-0987-654321fedcba"
}
```

**Respostas de Erro:**

- `400 Bad Request`: Se os dados de entrada forem inválidos (ex: e-mail em formato incorreto).
- `409 Conflict`: Se o e-mail fornecido já existir no sistema.


#### **`PATCH /clients`**

Atualiza um cliente no sistema.

- **Autenticação**: **Obrigatória** (via cabeçalho `x-api-key`)

**Corpo da Requisição (Request Body):** `application/json`

| Campo   | Tipo   | Descrição                  |
|---------|--------|----------------------------|
| `name`  | string | Nome do cliente.           |
| `email` | string | Endereço de e-mail único.  |

**Exemplo de Requisição:**

```bash
curl -X PATCH \
  http://localhost:3000/clients \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: <sua_api_key_aqui>'
  -d '{
    "name": "Leonardo Zanin",
    "email": "leo.zanin@example.com"
}'
```

**Resposta de Sucesso (Success Response):** `200 OK`

Retorna o objeto do cliente atualizado, incluindo seu `id` e a `apiKey` para autenticação futura.

```json
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "name": "Leonardo Zanin",
  "email": "leo.zanin@example.com",
  "favorites": [],
  "apiKey": "fedcba09-8765-4321-0987-654321fedcba"
}
```

**Respostas de Erro:**

- `400 Bad Request`: Se os dados de entrada forem inválidos (ex: e-mail em formato incorreto).
- `409 Conflict`: Se o e-mail fornecido já existir no sistema.


#### **`GET /clients`**

Mostra os dados do cliente logado no sistema.

- **Autenticação**: **Obrigatória** (via cabeçalho `x-api-key`)

**Corpo da Requisição (Request Body):** vazio

**Exemplo de Requisição:**

```bash
curl -X GET \
  http://localhost:3000/clients \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: <sua_api_key_aqui>'
```

**Resposta de Sucesso (Success Response):** `200 OK`

Retorna o objeto do cliente.

```json
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "name": "Leonardo Zanin",
  "email": "leo.zanin@example.com",
  "favorites": [],
  "apiKey": "fedcba09-8765-4321-0987-654321fedcba"
}
```

**Respostas de Erro:**

- `401 Unauthorized`: Se a `x-api-key` estiver ausente ou for inválida.

#### **`DELETE /clients`**

Remove um cliente do sistema.

- **Autenticação**: **Obrigatória** (via cabeçalho `x-api-key`)

**Corpo da Requisição (Request Body):** vazio

**Parâmetros da URL (URL Parameters):**

| Parâmetro     | Tipo    | Descrição                                   |
|---------------|---------|---------------------------------------------|
| `clientId`    | integer | O ID do cliente a ser removido.             |

**Exemplo de Requisição:**

```bash
curl -X DELETE \
  http://localhost:3000/clients/a1b2c3d4-e5f6-7890-1234-567890abcdef \
  -H 'x-api-key: <sua_api_key_aqui>'
```

**Resposta de Sucesso (Success Response):** `200 OK`

Retorna resposta.

```json
{
  "message": "Client deleted successfully"
}
```

**Respostas de Erro:**

- `401 Unauthorized`: Se a `x-api-key` estiver ausente ou for inválida.
- `403 ForbiddenError`: Se a `x-api-key` que estiver sendo usada for diferente do cliente sendo removido.

---

### 2. Favoritos

#### **`POST /favorites/{productId}`**

Adiciona um produto à lista de favoritos do cliente autenticado.

- **Autenticação**: **Obrigatória** (via cabeçalho `x-api-key`)

**Parâmetros da URL (URL Parameters):**

| Parâmetro     | Tipo    | Descrição                                   |
|---------------|---------|---------------------------------------------|
| `productId`   | integer | O ID do produto a ser adicionado aos favoritos. |

**Exemplo de Requisição:**

```bash
curl -X POST \
  http://localhost:3000/favorites/1 \
  -H 'x-api-key: <sua_api_key_aqui>'
```

**Resposta de Sucesso (Success Response):** `200 OK`

Retorna o objeto completo e atualizado do cliente, com o novo produto incluído na lista de `favorites`.

```json
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "name": "Leonardo Zanin",
  "email": "leo.zanin@example.com",
  "favorites": [
    {
      "id": 1,
      "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
      "price": 109.95,
      "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
    }
  ],
  "apiKey": "fedcba09-8765-4321-0987-654321fedcba"
}
```

**Respostas de Erro (Error Responses):**

- `401 Unauthorized`: Se a `x-api-key` estiver ausente ou for inválida.
- `404 Not Found`: Se o `productId` fornecido não corresponder a um produto existente.
- `409 Conflict`: Se o produto já estiver na lista de favoritos do cliente.

#### **`DELETE /favorites/{productId}`**

Remove um produto da lista de favoritos do cliente autenticado.

- **Autenticação**: **Obrigatória** (via cabeçalho `x-api-key`)

**Parâmetros da URL (URL Parameters):**

| Parâmetro     | Tipo    | Descrição                                   |
|---------------|---------|---------------------------------------------|
| `productId`   | integer | O ID do produto a ser adicionado aos favoritos. |

**Exemplo de Requisição:**

```bash
curl -X DELETE \
  http://localhost:3000/favorites/1 \
  -H 'x-api-key: <sua_api_key_aqui>'
```

**Resposta de Sucesso (Success Response):** `200 OK`

Retorna o objeto completo e atualizado do cliente, com o novo produto incluído na lista de `favorites`.

```json
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "name": "Leonardo Zanin",
  "email": "leo.zanin@example.com",
  "favorites": [
  ],
  "apiKey": "fedcba09-8765-4321-0987-654321fedcba"
}
```

**Respostas de Erro (Error Responses):**

- `401 Unauthorized`: Se a `x-api-key` estiver ausente ou for inválida.
- `404 Not Found`: Se o `productId` fornecido não corresponder a um produto existente.


## Licença
MIT
