# Projeto API Node.js com TypeScript, MongoDB e JWT

Este é um guia para configurar e executar uma API Node.js com TypeScript, usando MongoDB como banco de dados e JWT para autenticação.

## Requisitos

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [TypeScript](https://www.typescriptlang.org/)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Postman](https://www.postman.com/downloads/) (para testar a API)

## Instalação do Node.js e TypeScript

### Windows
1. Acesse [nodejs.org](https://nodejs.org/)
2. Baixe a versão LTS
3. Execute o instalador e siga as instruções na tela
4. Instale o TypeScript globalmente: `npm install -g typescript`

### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g typescript
```

### macOS
```bash
# Usando Homebrew
brew install node
npm install -g typescript
```

## Instalação do Docker

### Windows/macOS
1. Baixe o [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Execute o instalador e siga as instruções

### Linux
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

## Configuração do Projeto

1. Clone este repositório
2. Configure os arquivos de ambiente:

   a. Copie o arquivo `app.env.example` para `app.env`:
   ```bash
   cp app.env.example app.env
   ```

   b. Copie o arquivo `mongo.env.example` para `mongo.env`:
   ```bash
   cp mongo.env.example mongo.env
   ```

3. Edite os arquivos com suas configurações:
   
   `app.env`:
   ```
   DB_HOST=mongodb
   DB_PORT=27017
   DB_NAME=meubancodedados
   MONGODB_USERNAME=usuario
   MONGODB_PASSWORD=senha
   SECRET=minhachavesecretajwt
   ```

   `mongo.env`:
   ```
   MONGO_INITDB_ROOT_USERNAME=usuario
   MONGO_INITDB_ROOT_PASSWORD=senha
   MONGO_INITDB_DATABASE=meubancodedados
   ```

4. Instale as dependências do projeto:
   ```bash
   npm install
   ```

## Compilando o Projeto TypeScript

Para compilar o projeto TypeScript para JavaScript:

```bash
npm run build
```

Isso irá gerar os arquivos JavaScript na pasta `dist/`.

## Executando o Projeto em Desenvolvimento

Para executar o projeto em modo de desenvolvimento com recarga automática:

```bash
npm run dev
```

## Executando com Docker Compose

1. O projeto já contém um arquivo `docker-compose.yaml` configurado com dois serviços:
   - MongoDB: banco de dados
   - API: aplicação Node.js com TypeScript

2. Para iniciar a aplicação, execute:
   ```bash
   docker-compose up -d
   ```

3. Para verificar os logs da aplicação:
   ```bash
   docker-compose logs -f api
   ```

4. Para parar a aplicação:
   ```bash
   docker-compose down
   ```

## Iniciando o Projeto Manualmente (sem Docker)

1. Compile o projeto TypeScript:
   ```bash
   npm run build
   ```

2. Inicie o MongoDB localmente ou use um serviço hospedado

3. Inicie o servidor:
   ```bash
   npm start
   ```

## Testando a API com Postman

### Importando a Coleção

1. Abra o Postman
2. Clique em "Import" na barra superior
3. Arraste o arquivo `API_NODEJS_MONGODB_JWT.postman_collection.json` ou navegue até ele
4. Clique em "Import"

### Configurando Variáveis de Ambiente

Certifique-se de configurar as seguintes variáveis de ambiente no Postman:

- `base_url`: http://localhost:3000 (ou a URL onde sua API está hospedada)

### Executando os Testes

A coleção inclui testes automatizados para cada requisição. Para executá-los:

1. Clique com o botão direito na coleção importada
2. Selecione "Run collection"
3. Configure as iterações e outras opções, se necessário
4. Clique em "Run"

### Endpoints Disponíveis

1. **Cadastro de Usuário**
   - Método: POST
   - Endpoint: `{{base_url}}/api/auth/signup`
   - Body: 
     ```json
     {
       "username": "usuarioteste",
       "email": "usuario@teste.com",
       "password": "senha123"
     }
     ```

2. **Login**
   - Método: POST
   - Endpoint: `{{base_url}}/api/auth/signin`
   - Body: 
     ```json
     {
       "username": "usuarioteste",
       "password": "senha123"
     }
     ```

3. **Rota Pública**
   - Método: GET
   - Endpoint: `{{base_url}}/api/test/all`
   - Descrição: Acessível para todos os usuários, sem autenticação

4. **Rota de Usuário** (requer autenticação)
   - Método: GET
   - Endpoint: `{{base_url}}/api/test/user`
   - Header: `x-access-token: {{auth_token}}`
   - Descrição: Acessível apenas para usuários autenticados

5. **Rota de Moderador** (requer autenticação + papel de moderador)
   - Método: GET
   - Endpoint: `{{base_url}}/api/test/mod`
   - Header: `x-access-token: {{auth_token}}`
   - Descrição: Acessível apenas para moderadores

6. **Rota de Administrador** (requer autenticação + papel de administrador)
   - Método: GET
   - Endpoint: `{{base_url}}/api/test/admin`
   - Header: `x-access-token: {{auth_token}}`
   - Descrição: Acessível apenas para administradores

## Estrutura do Projeto TypeScript

```
src/
├── config/             # Configurações da aplicação
├── controllers/        # Controladores da API
├── middlewares/        # Middlewares personalizados
├── models/             # Modelos do MongoDB
│   └── interfaces/     # Interfaces TypeScript para os modelos
├── routes/             # Rotas da API
└── server.ts           # Arquivo principal da aplicação

dist/                   # Código JavaScript compilado
```

## Fluxo de Teste Recomendado

1. Execute "Cadastro de Usuário" para criar um novo usuário
2. Execute "Login" para obter um token JWT
3. Teste as diferentes rotas com níveis de acesso:
   - `/api/test/all` (acesso público)
   - `/api/test/user` (requer autenticação)
   - `/api/test/mod` (requer papel de moderador)
   - `/api/test/admin` (requer papel de administrador)

## Solução de Problemas

### Erro de Conexão com o MongoDB
- Verifique se as credenciais estão corretas no arquivo `app.env`
- Verifique se o serviço do MongoDB está rodando

### Erro de Autenticação
- Verifique se o token JWT está sendo enviado corretamente no header `x-access-token`
- Verifique se a chave secreta (SECRET) está configurada corretamente no arquivo `app.env`

### Erros de Compilação TypeScript
- Verifique se todas as dependências de tipos estão instaladas: `npm install --save-dev @types/express @types/mongoose @types/node @types/bcryptjs @types/jsonwebtoken @types/cors`
- Verifique a configuração no arquivo `tsconfig.json`

## Contribuição

Para contribuir com este projeto, por favor:
1. Faça um fork do repositório
2. Crie um branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Envie para o branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT.
