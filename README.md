# Hotel Pet

Site do sistema **Hotel Pet**, um sistema de gerenciamento de estadia de pets em períodos específicos. O cliente pode fazer reservas e acompanhar o dia a dia do seu animal.

O HTML e o CSS foram feitos na disciplina **Programação Web I** (versão marcada com a tag `web1`). Na disciplina **Programação Web II** o projeto continua com **JavaScript puro**, sem bibliotecas ou frameworks, adicionando a navegação, as buscas e a edição das tabelas.

## Visão desenvolvida

O sistema tem três tipos de acesso (Cliente, Funcionário e Gerente). Este projeto implementa a **visão do Gerente**, que é a mais completa e realiza todas as ações dos outros perfis, além de:

- Gerenciar usuários (cadastrar, editar, remover e mudar status)
- Alterar a função de um usuário (cliente, funcionário ou gerente)
- Editar reservas com status finalizada
- Acessar as configurações do sistema (valor da diária e vagas disponíveis)

## Como os dados funcionam

Não existe backend. Os dados (usuários, pets, reservas e configurações) ficam salvos no **localStorage** do navegador. Na primeira vez que o site é aberto, eles são preenchidos com dados de exemplo (`js/dados.js`). Para voltar aos dados iniciais, basta rodar `resetarDados()` no console do navegador (F12).

Para abrir um item específico, o id vai na URL, por exemplo `ver-pet.html?id=1`.

## Como entrar

Use o email de um usuário **ativo** e qualquer senha (sem backend a senha não é conferida):

| Email | Função | Status |
|---|---|---|
| joaodasilva@pet.com | Gerente | Ativo |
| josedasilva@pet.com | Cliente | Ativo |
| maria@pet.com | Funcionário | Inativo (não consegue entrar) |

Também dá pra criar uma conta nova pela tela "Criar uma conta". Marcando "mantenha-me conectado", o login continua mesmo depois de fechar o navegador.

## Etapas da Web II

- [x] **Etapa 1, Navegação:** login e criar conta, proteção das telas internas, botão sair, topo com o usuário logado (levando ao perfil), tabelas montadas a partir dos dados salvos e telas de visualizar e editar abrindo o item certo pelo id.
- [x] **Etapa 2, Buscas:** os campos de pesquisa de reservas, pets e usuários agora filtram a tabela (dá pra buscar sem acento e apertar Enter pra pesquisar). O Limpar volta a lista completa e em usuários o "Visualizar Por: Função" separa a lista por função.
- [x] **Etapa 3, Tabelas:** agora dá pra cadastrar, editar e apagar de verdade.
  - Pets: cadastrar, editar, trocar a foto e deletar (deletar um pet apaga as reservas dele junto).
  - Reservas: o total é calculado sozinho pelas diárias x valor da diária, e não deixa reservar se as vagas do período já estiverem ocupadas. Na edição os campos mudam com o status, igual no Figma: em andamento aparecem as anotações e as imagens, finalizada aparece o botão da nota fiscal. O gerente pode editar reserva finalizada.
  - Usuários: cadastrar, editar (inclusive a função), remover e mudar status dos marcados. Quem tem pet não pode ser removido e o gerente não consegue remover ou desativar a própria conta.
  - Perfil e configurações salvando.
  - Clicando no título das colunas das tabelas ordena (clicando de novo inverte).

## Telas

- Login e Criar conta
- Reservas (lista, criar, editar e visualizar)
- Pets (lista, cadastrar, editar e visualizar)
- Usuários (lista, cadastrar, editar e visualizar)
- Configurações
- Editar perfil

## Como abrir

Baixe o projeto e abra o arquivo `index.html` no navegador.

Também dá para abrir por um servidor local (por exemplo, rodando `python -m http.server` na pasta do projeto e acessando `http://localhost:8000`).

## Estrutura

```
hotel-pet/
├── index.html          (e demais telas .html)
├── css/
│   └── estilo.css
├── js/
│   ├── dados.js        (dados iniciais e funções do localStorage)
│   ├── comum.js        (sessão, topo e funções usadas em todas as telas)
│   └── ...             (um arquivo por tela)
└── img/
```

## Tecnologias

- HTML
- CSS
- JavaScript (sem bibliotecas ou frameworks)
