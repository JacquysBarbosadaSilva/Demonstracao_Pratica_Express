# Express.js – Cardápio de Pedidos (Vue 3 + Express)

Projeto desenvolvido para o seminário sobre **Express.js** do curso de Análise e Desenvolvimento de Sistemas (ADS) do **SENAI**.

## Sumário

- [Objetivo](#objetivo)
- [Integrantes](#integrantes)
- [Tecnologias e versões](#tecnologias-e-versões)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Execução](#execução)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Vulnerabilidades pesquisadas](#vulnerabilidades-pesquisadas)
- [Evidências / imagens](#evidências--imagens)
- [Link do GitHub Pages](#link-do-github-pages)
- [Referências](#referências)

---

## Objetivo

Demonstrar, na prática, o uso do **Express.js** como back-end de uma aplicação web. O projeto é um "Cardápio" simples que anota e exclui pedidos: o **Express.js** fornece a API REST e o **Vue.js** cuida da interface.

O Express é um framework web para Node.js, minimalista e flexível, que simplifica o trabalho com o módulo HTTP nativo oferecendo **roteamento** e **middlewares**, permitindo criar APIs com menos código. Neste projeto ele exemplifica:

- criação de um servidor HTTP;
- definição de rotas (`GET`, `POST`, `DELETE`);
- uso de middleware (`express.json()`);
- integração com um front-end reativo consumindo a API via `fetch`.

## Integrantes

- Ana Lívia dos Santos Lopes
- Jacquys Barbosa da Silva
- João Gustavo Mota Ramos
- João Pedro da Cunha Machado
- Jhônatas Lopes da Silva
- Lucas Machado Crispim
- Luis Gustavo Cesar Consoli de Almeida

**Professor:** Wesley Novaes Fioreze Costa
**Curso:** ADS – 2º Semestre – SENAI

## Tecnologias e versões

| Tecnologia | Versão | Uso no projeto |
|---|---|---|
| Node.js | 18 ou superior | Ambiente de execução do servidor |
| Express.js | `X.X.X` *(conferir no `package.json`)* | API REST (back-end) |
| Vue.js | `3.X.X` *(conferir no `package.json`)* | Interface (front-end) |
| Vite | `X.X.X` *(conferir no `package.json`)* | Servidor de desenvolvimento e build do front-end |
| npm | acompanha o Node.js | Gerenciador de pacotes |

> Para ver as versões exatas instaladas, rode `npm list express vue vite`.

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior e npm instalados. Confira com:

  ```sh
  node -v
  npm -v
  ```

- [Git](https://git-scm.com/) para clonar o repositório.
- Editor recomendado: [VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (desative o Vetur).

## Instalação

```sh
# 1. Clonar o repositório
git clone https://github.com/SEU-USUARIO/vue-project-express.git

# 2. Entrar na pasta do projeto
cd vue-project-express

# 3. Instalar as dependências
npm install
```

## Execução

São necessários **dois terminais**, um para o front-end e outro para a API.

**Terminal 1 – Front-end (Vue + Vite):**

```sh
npm run dev
```

**Terminal 2 – Back-end (Express.js):**

```sh
node server.js
```

- API disponível em: `http://localhost:3000`
- Front-end disponível no endereço exibido pelo Vite (normalmente `http://localhost:5173`).

> O front-end chama a API por caminhos relativos (`/api/pedidos`). Por isso, em desenvolvimento, o `vite.config.js` precisa ter um **proxy** apontando para o Express:
>
> ```js
> export default defineConfig({
>   plugins: [vue()],
>   server: {
>     proxy: {
>       '/api': 'http://localhost:3000'
>     }
>   }
> })
> ```

**Build para produção:**

```sh
npm run build
```

## Estrutura do projeto

```text
vue-project-express/
├── node_modules/        # Dependências instaladas pelo npm (não editar)
├── public/              # Arquivos estáticos
├── src/
│   ├── App.vue          # Componente principal: tela do Cardápio
│   └── main.js          # Ponto de entrada do Vue (createApp + mount)
├── index.html           # HTML base da aplicação Vite
├── server.js            # Servidor Express.js (API de pedidos)
├── vite.config.js       # Configuração do Vite
├── package.json         # Dependências e scripts
├── package-lock.json    # Versões exatas das dependências
└── README.md
```

| Arquivo | Responsabilidade |
|---|---|
| `server.js` | Cria o servidor Express na porta 3000, aplica o middleware `express.json()` e define as rotas da API. |
| `src/App.vue` | Interface: campo de texto, botão "Pedir", lista de pedidos e botão "Excluir". Consome a API com `fetch`. |
| `src/main.js` | Inicializa a aplicação Vue e a monta no elemento `#app`. |

## Funcionalidades

**Interface (Vue.js):**

- Adicionar um pedido digitando o nome e clicando em **Pedir** ou pressionando **Enter**;
- Listar todos os pedidos cadastrados;
- Excluir um pedido pelo botão **Excluir**;
- Bloqueio de pedidos vazios (validação com `trim()`).

**API (Express.js):**

| Método | Rota | Descrição | Resposta |
|---|---|---|---|
| `GET` | `/api/pedidos` | Lista todos os pedidos | `200` + array JSON |
| `POST` | `/api/pedidos` | Cria um pedido. Corpo: `{ "nome": "..." }` | `201` + pedido criado (`id`, `nome`) |
| `DELETE` | `/api/pedidos/:id` | Remove o pedido pelo `id` | `200` + mensagem de confirmação |

Exemplo de uso com `curl`:

```sh
# Criar um pedido
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{"nome": "X-Burger"}'

# Listar pedidos
curl http://localhost:3000/api/pedidos

# Excluir um pedido
curl -X DELETE http://localhost:3000/api/pedidos/1700000000000
```

> **Observação:** os pedidos ficam armazenados **em memória** (array `pedidos`). Ao reiniciar o servidor, os dados são perdidos.

## Vulnerabilidades pesquisadas

### 1. Open Redirect em `res.redirect()` – CVE-2024-29041

- **Severidade:** CVSS 6.1 (Médio)
- **Descrição:** o Express codifica a URL com `encodeurl` antes de enviá-la ao cabeçalho `Location`. Essa codificação pode interpretar URLs malformadas de forma inesperada, fazendo com que a validação por lista de permissão (allowlist) avalie um destino diferente do real.
- **Impacto:** URLs malformadas passam despercebidas pelas allowlists de redirecionamento. O atacante redireciona a vítima para um site falso a partir do domínio legítimo, viabilizando phishing e roubo de credenciais.
- **Versões afetadas:** Express `< 4.19.2` e Express `5.0.0-alpha` / `5.0.0-beta` anteriores à `5.0.0-beta.3`.
- **Mitigação:**
  - atualizar para a versão `4.19.2` ou superior;
  - validar a URL com `new URL()` antes de chamar `res.location` / `res.redirect`.

### 2. Prototype Pollution no `qs` (DoS) – CVE-2022-24999

- **Severidade:** CVSS 7.5 (Alto)
- **Descrição:** a biblioteca `qs`, usada pelo Express para interpretar query strings, não bloqueava chaves como `__proto__`. Isso permitia modificar o protótipo global de objetos JavaScript, alterando propriedades herdadas por todos os objetos da aplicação.
- **Impacto:** um atacante pode injetar payloads maliciosos via query string (`?__proto__[x]=y`), corrompendo globalmente o `Object.prototype`. Isso pode travar o processo Node.js, causando negação de serviço (DoS), sem exigir autenticação.
- **Versões afetadas:** Express `< 4.17.3`.
- **Mitigação:**
  - atualizar para a versão `4.17.3` ou superior e rodar `npm audit`;
  - usar `app.set("query parser", "simple")` caso não sejam necessários objetos aninhados.

> Para verificar se o projeto está exposto, rode `npm audit` e confira a versão instalada com `npm list express`.

## Evidências / imagens

> Substitua os caminhos abaixo pelos prints do seu projeto (sugestão: salvar em uma pasta `docs/img/`).

**Tela principal da aplicação (Cardápio):**

<img width="544" height="365" alt="image" src="https://github.com/user-attachments/assets/dc74dc88-554f-4621-810f-ddb2751d8453" />

**Servidor Express em execução no terminal:**

<img width="566" height="211" alt="image" src="https://github.com/user-attachments/assets/c655f0d3-5dd9-4989-99d4-fc85e3b9a5e0" />

**Teste da API (GET /api/pedidos):**

<img width="384" height="228" alt="image" src="https://github.com/user-attachments/assets/3a855b35-d3c7-4cd8-a339-2acea088766d" />
<img width="617" height="372" alt="image" src="https://github.com/user-attachments/assets/7f014b39-b161-4982-bc0c-7138ebfb781e" />


## Link do GitHub Pages

🔗 https://jacquysbarbosadasilva.github.io/Apresentacao_ExpressJS/

> **Atenção:** o GitHub Pages só hospeda arquivos estáticos (HTML, CSS e JS). Ele publica o front-end em Vue, mas **não executa o `server.js`**. Para usar a API, é preciso rodar o Express localmente ou hospedá-lo em outro serviço.

## Referências

- [Express.js – Site oficial](https://expressjs.com/)
- [Express.js – Guia de roteamento](https://expressjs.com/en/guide/routing/)
- [Express.js – Guia de middlewares](https://expressjs.com/en/guide/using-middleware/)
- [npm – Pacote express](https://www.npmjs.com/package/express)
- [StackShare – Express.js](https://stackshare.io/expressjs)
- [TreinaWeb – O que é Express.js](https://www.treinaweb.com.br/blog/o-que-e-o-express-js)
- [Wikipédia – Express.js](https://pt.wikipedia.org/wiki/Express.js)
- [Vue.js – Documentação](https://vuejs.org/)
- [Vite – Configuração](https://vite.dev/config/)
- [NVD – CVE-2024-29041](https://nvd.nist.gov/vuln/detail/CVE-2024-29041)
- [NVD – CVE-2022-24999](https://nvd.nist.gov/vuln/detail/CVE-2022-24999)
