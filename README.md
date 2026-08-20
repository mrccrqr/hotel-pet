# Hotel Pet

Site do sistema **Hotel Pet**, um sistema de gerenciamento de estadia de pets em períodos específicos. O cliente pode fazer reservas e acompanhar o dia a dia do seu animal.

Projeto desenvolvido para a disciplina de Programação Web, utilizando apenas **HTML e CSS**, sem bibliotecas ou frameworks. Todas as telas são estáticas (não há backend).

## Visão desenvolvida

O sistema tem três tipos de acesso (Cliente, Funcionário e Gerente). Este projeto implementa a **visão do Gerente**, que é a mais completa e realiza todas as ações dos outros perfis, além de:

- Gerenciar usuários (cadastrar, editar, remover e mudar status)
- Alterar a função de um usuário (cliente, funcionário ou gerente)
- Editar reservas com status finalizada
- Acessar as configurações do sistema (valor da diária e vagas disponíveis)

## Telas

- Login e Criar conta
- Reservas (lista, criar, editar e visualizar)
- Pets (lista, cadastrar, editar e visualizar)
- Usuários (lista e cadastro)
- Configurações
- Editar perfil

## Como abrir

Baixe o projeto e abra o arquivo `index.html` no navegador.

Obs: por usar CSS externo e imagens, o ideal é abrir por um servidor local (por exemplo, rodando `python -m http.server` na pasta do projeto e acessando `http://localhost:8000`), para o navegador carregar todos os arquivos corretamente.

## Estrutura

```
hotel-pet/
├── index.html          (e demais telas .html)
├── css/
│   └── estilo.css
└── img/
```

## Tecnologias

- HTML
- CSS
