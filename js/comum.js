// comum.js
// Funcoes usadas em varias telas: login do usuario, topo da pagina e mensagens.

// ---------- usuario logado ----------

// guarda o id de quem fez login.
// com "mantenha-me conectado" usa o localStorage (continua depois de fechar o navegador),
// sem marcar usa o sessionStorage (some quando fecha a aba).
function fazerLogin(id, manterConectado) {
    if (manterConectado) {
        localStorage.setItem('usuarioLogado', id);
    } else {
        sessionStorage.setItem('usuarioLogado', id);
    }
}

function fazerLogout() {
    localStorage.removeItem('usuarioLogado');
    sessionStorage.removeItem('usuarioLogado');
}

// devolve o usuario logado, ou null se ninguem estiver logado
function pegarUsuarioLogado() {
    const id = sessionStorage.getItem('usuarioLogado') || localStorage.getItem('usuarioLogado');
    if (id === null) {
        return null;
    }
    const usuario = buscarPorId('usuarios', id);
    // se o usuario foi apagado ou ficou inativo, nao vale mais
    if (!usuario || usuario.status !== 'Ativo') {
        return null;
    }
    return usuario;
}

// ---------- outras funcoes ----------

// pega um valor da URL. Ex: em ver-pet.html?id=3, pegarParametro('id') devolve '3'
function pegarParametro(nome) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(nome);
}

// mostra uma mensagem no paragrafo com id="mensagem". tipo: 'erro', 'aviso' ou 'sucesso'
function mostrarMensagem(texto, tipo) {
    const mensagem = document.getElementById('mensagem');
    mensagem.textContent = texto;
    mensagem.className = 'mensagem ' + (tipo || 'erro');
    mensagem.hidden = false;
}

// quando o id da URL nao existe, troca o conteudo da tela por um aviso
function mostrarNaoEncontrado(texto, voltarPara) {
    document.querySelector('.cartao').innerHTML =
        '<h2>' + texto + '</h2>' +
        '<p>O item pode ter sido removido ou o endereço está errado.</p>' +
        '<a href="' + voltarPara + '" class="botao-voltar">← Voltar</a>';
}

// deixa o texto minusculo e sem acento, assim "pacoca" acha "Paçoca"
function normalizar(texto) {
    return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// true se o texto tiver o que foi digitado na busca (busca vazia aceita tudo)
function contem(texto, busca) {
    return normalizar(texto).includes(normalizar(busca));
}

// transforma o que o usuario digitou em numero: 'R$ 12,50' vira 12.5
// se ficar vazio ou nao for numero devolve null
function lerValor(texto) {
    const limpo = texto.replace('R$', '').replace(',', '.').trim();
    if (limpo === '' || isNaN(limpo)) {
        return null;
    }
    return Number(limpo);
}

// coloca os pets como opcoes de um select. Ex: "Max (José da Silva)"
function preencherSelectPets(select) {
    listar('pets').forEach(function (pet) {
        const dono = buscarPorId('usuarios', pet.donoId);
        const opcao = document.createElement('option');
        opcao.value = pet.id;
        opcao.textContent = pet.nome + ' (' + nomeCompleto(dono) + ')';
        select.appendChild(opcao);
    });
}

// coloca os usuarios ativos como opcoes de um select (para escolher o dono do pet).
// o idDono serve para o dono atual aparecer mesmo se estiver inativo
function preencherSelectUsuarios(select, idDono) {
    listar('usuarios').forEach(function (usuario) {
        if (usuario.status === 'Ativo' || usuario.id == idDono) {
            const opcao = document.createElement('option');
            opcao.value = usuario.id;
            opcao.textContent = nomeCompleto(usuario);
            select.appendChild(opcao);
        }
    });
}

// botao do olho que mostra ou esconde a senha (login e criar conta)
function configurarVerSenha() {
    const botao = document.getElementById('ver-senha');
    const senha = document.getElementById('senha');
    botao.addEventListener('click', function () {
        if (senha.type === 'password') {
            senha.type = 'text';
            botao.classList.add('ativo');
        } else {
            senha.type = 'password';
            botao.classList.remove('ativo');
        }
    });
}

// ---------- roda em todas as telas internas ----------
// (as telas de login e criar conta tem a classe "tela-login" no body e ficam de fora)

let usuarioAtual = null;

if (!document.body.classList.contains('tela-login')) {
    usuarioAtual = pegarUsuarioLogado();

    // sem login volta para a tela de login
    if (usuarioAtual === null) {
        fazerLogout();
        window.location.href = 'index.html';
    } else {
        // mostra o nome e a foto no topo
        document.getElementById('nome-usuario').textContent = nomeCompleto(usuarioAtual);
        if (usuarioAtual.foto) {
            document.getElementById('foto-usuario').src = usuarioAtual.foto;
        }

        document.getElementById('sair').addEventListener('click', function (evento) {
            evento.preventDefault();
            fazerLogout();
            window.location.href = 'index.html';
        });
    }
}
