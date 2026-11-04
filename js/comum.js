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

// guarda um aviso pra mostrar na proxima tela (ex: "Pet salvo!" depois de voltar pra lista)
function avisarNaProximaTela(texto) {
    sessionStorage.setItem('aviso', texto);
}

// le a foto escolhida no input file e diminui ela antes de salvar,
// senao uma foto de celular sozinha ja enche o localStorage
function lerImagem(arquivo, quandoTerminar) {
    const leitor = new FileReader();
    leitor.onload = function () {
        const img = new Image();
        img.onload = function () {
            const maximo = 400; // lado maior fica com no maximo 400px
            let largura = img.width;
            let altura = img.height;
            if (largura > maximo || altura > maximo) {
                if (largura > altura) {
                    altura = Math.round(altura * maximo / largura);
                    largura = maximo;
                } else {
                    largura = Math.round(largura * maximo / altura);
                    altura = maximo;
                }
            }
            const canvas = document.createElement('canvas');
            canvas.width = largura;
            canvas.height = altura;
            canvas.getContext('2d').drawImage(img, 0, 0, largura, altura);
            quandoTerminar(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = leitor.result;
    };
    leitor.readAsDataURL(arquivo);
}

// quantas diarias tem entre a chegada e a partida (02/05 ate 06/05 = 4 diarias)
function contarDiarias(chegada, partida) {
    const umDia = 24 * 60 * 60 * 1000;
    return Math.round((new Date(partida) - new Date(chegada)) / umDia);
}

function calcularTotal(chegada, partida) {
    return contarDiarias(chegada, partida) * pegarConfiguracoes().diaria;
}

// confere se tem vaga em todos os dias do periodo.
// so contam as reservas Reservada e Em andamento. idIgnorar e a propria reserva quando ta editando
// devolve a data que lotou, ou null se tiver vaga
function diaSemVaga(chegada, partida, idIgnorar) {
    const vagas = pegarConfiguracoes().vagas;
    const ativas = listar('reservas').filter(function (r) {
        return r.id != idIgnorar && (r.status === 'Reservada' || r.status === 'Em andamento');
    });

    const dia = new Date(chegada);
    const fim = new Date(partida);
    while (dia < fim) {
        const hoje = dia.toISOString().slice(0, 10);
        // reservas que tem o pet no hotel nessa noite
        const ocupadas = ativas.filter(function (r) {
            return r.chegada <= hoje && r.partida > hoje;
        }).length;
        if (ocupadas >= vagas) {
            return hoje;
        }
        dia.setUTCDate(dia.getUTCDate() + 1); // proximo dia
    }
    return null;
}

// ordenacao das tabelas clicando no titulo da coluna (as setinhas do Figma)
// guarda qual coluna ta ordenando e se e crescente ou decrescente
let ordem = { campo: '', crescente: true };

function configurarOrdenacao(quandoMudar) {
    document.querySelectorAll('th.ordenavel').forEach(function (th) {
        th.addEventListener('click', function () {
            if (ordem.campo === th.dataset.campo) {
                ordem.crescente = !ordem.crescente; // clicou de novo: inverte
            } else {
                ordem.campo = th.dataset.campo;
                ordem.crescente = true;
            }
            // tira a seta das outras colunas e coloca nessa
            document.querySelectorAll('th.ordenavel').forEach(function (outro) {
                outro.classList.remove('crescente', 'decrescente');
            });
            th.classList.add(ordem.crescente ? 'crescente' : 'decrescente');
            quandoMudar();
        });
    });
}

// ordena a lista pela coluna escolhida. pegarValor diz qual valor usar de cada item
function ordenar(lista, pegarValor) {
    if (ordem.campo === '') {
        return lista;
    }
    return lista.slice().sort(function (a, b) {
        let x = pegarValor(a, ordem.campo);
        let y = pegarValor(b, ordem.campo);
        if (typeof x === 'string') {
            x = normalizar(x);
            y = normalizar(y);
        }
        let resultado = 0;
        if (x < y) resultado = -1;
        if (x > y) resultado = 1;
        return ordem.crescente ? resultado : -resultado;
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

        // se a tela anterior deixou algum aviso, mostra aqui
        const aviso = sessionStorage.getItem('aviso');
        if (aviso && document.getElementById('mensagem')) {
            mostrarMensagem(aviso, 'sucesso');
            sessionStorage.removeItem('aviso');
        }

        document.getElementById('sair').addEventListener('click', function (evento) {
            evento.preventDefault();
            fazerLogout();
            window.location.href = 'index.html';
        });
    }
}
