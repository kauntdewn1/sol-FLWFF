# Solana.com Website

Este é o repositório oficial do website da Solana Foundation. O site é construído usando Next.js, TypeScript e várias outras tecnologias modernas.

## 🚀 Tecnologias

- [Next.js](https://nextjs.org/) - Framework React
- [TypeScript](https://www.typescriptlang.org/) - Superset JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Jest](https://jestjs.io/) - Framework de testes
- [ESLint](https://eslint.org/) - Linter
- [Prettier](https://prettier.io/) - Formatador de código
- [Web3.Storage](https://web3.storage/) - Armazenamento descentralizado (IPFS)
- [Web3Auth](https://web3auth.io/) - Autenticação Web3

## 📋 Pré-requisitos

- Node.js 18.x ou superior
- Yarn 1.22.x ou superior
- Git
- Conta no Web3.Storage (para token de API)
- Conta no Web3Auth (para autenticação)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/solana-foundation/solana-com.git
cd solana-com
```

2. Instale as dependências:

```bash
yarn install
yarn add @web3-storage/w3up-client web3.storage
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env.local
```

4. Configure as variáveis no `.env.local`:

```env
# Web3.Storage
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=seu_token_aqui

# Web3Auth
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=seu_client_id_aqui
NEXT_PUBLIC_WEB3AUTH_CLIENT_SECRET=seu_client_secret_aqui
```

5. Inicie o servidor de desenvolvimento:

```bash
yarn dev
```

O site estará disponível em `http://localhost:9002`

## 🔐 Configuração do Web3.Storage

1. Acesse https://console.web3.storage/
2. Crie uma conta ou faça login
3. Vá em "API Tokens"
4. Crie um novo token ou copie um existente
5. Adicione o token no arquivo `.env.local`

## 🔐 Configuração do Web3Auth

1. Acesse https://dashboard.web3auth.io/
2. Crie um novo projeto
3. Configure as URLs permitidas (ex: http://localhost:9002)
4. Copie o Client ID e Client Secret
5. Adicione no arquivo `.env.local`

## 🛠️ Scripts Disponíveis

- `yarn dev` - Inicia o servidor de desenvolvimento
- `yarn build` - Cria a build de produção
- `yarn start` - Inicia o servidor de produção
- `yarn lint` - Executa o linter
- `yarn lint:fix` - Corrige problemas de linting
- `yarn test` - Executa os testes
- `yarn test:watch` - Executa os testes em modo watch
- `yarn test:coverage` - Gera relatório de cobertura de testes
- `yarn typecheck` - Verifica tipos TypeScript
- `yarn format:check` - Verifica formatação do código
- `yarn format:all` - Formata todo o código
- `yarn clean` - Remove arquivos gerados
- `yarn clean:install` - Limpa e reinstala dependências

## 📁 Estrutura do Projeto

```
solana-com/
├── src/
│   ├── components/     # Componentes React
│   ├── pages/         # Páginas Next.js
│   ├── styles/        # Estilos globais
│   ├── utils/         # Funções utilitárias
│   └── types/         # Definições de tipos
├── public/            # Arquivos estáticos
├── tests/            # Testes
└── ...
```

## 🧪 Testes

O projeto usa Jest e React Testing Library para testes. Para executar os testes:

```bash
yarn test
```

Para ver a cobertura de testes:

```bash
yarn test:coverage
```

## 📝 Convenções de Código

- Usamos ESLint e Prettier para manter a consistência do código
- Seguimos o guia de estilo do Next.js
- Commits seguem o padrão Conventional Commits

## 🔒 Segurança

- Todas as dependências são verificadas regularmente
- Implementamos headers de segurança
- Usamos CSP (Content Security Policy)
- Rate limiting está configurado

## 📈 Monitoramento

- Logging estruturado
- Monitoramento de erros com Sentry
- Métricas de performance

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch de feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para suporte, envie um email para support@solana.com ou abra uma issue no GitHub.
