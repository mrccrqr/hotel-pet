// usuarios.js - lista de usuarios

// "Visualizar Por": false = lista normal, true = separado por funcao
let verPorFuncao = false;

function linhaUsuario(usuario) {
    // quem nao tem foto aparece com o avatar padrao
    const foto = usuario.foto || 'img/avatar.png';

    return '<tr>' +
            '<td><input type="checkbox" value="' + usuario.id + '"></td>' +
            '<td><img src="' + foto + '" alt="Foto" class="foto-tabela"></td>' +
            '<td>' + usuario.id + '</td>' +
            '<td>' + usuario.email + '</td>' +
            '<td>' + nomeCompleto(usuario) + '</td>' +
            '<td>' + usuario.funcao + '</td>' +
            '<td><span class="status ' + classeStatus(usuario.status) + '">' + usuario.status + '</span></td>' +
            '<td>' + formatarData(usuario.criadoEm) + '</td>' +
            '<td>' +
                '<a href="novo-usuario.html?id=' + usuario.id + '">Editar</a> ' +
                '<a href="perfil.html?id=' + usuario.id + '">Visualizar</a>' +
            '</td>' +
        '</tr>';
}

function mostrarUsuarios(usuarios) {
    const tabela = document.getElementById('lista-usuarios');
    tabela.innerHTML = '';

    usuarios = ordenar(usuarios, function (usuario, campo) {
        if (campo === 'nome') return nomeCompleto(usuario);
        return usuario[campo];
    });
    document.getElementById('marcar-todos').checked = false;

    if (verPorFuncao) {
        // um titulo pra cada funcao e embaixo os usuarios dela
        ['Gerente', 'Funcionário', 'Cliente'].forEach(function (funcao) {
            const daFuncao = usuarios.filter(function (u) {
                return u.funcao === funcao;
            });
            if (daFuncao.length > 0) {
                tabela.innerHTML += '<tr class="grupo"><td colspan="9">' + funcao + ' (' + daFuncao.length + ')</td></tr>';
                daFuncao.forEach(function (usuario) {
                    tabela.innerHTML += linhaUsuario(usuario);
                });
            }
        });
    } else {
        usuarios.forEach(function (usuario) {
            tabela.innerHTML += linhaUsuario(usuario);
        });
    }

    document.getElementById('lista-vazia').hidden = usuarios.length > 0;
}

// ---------- busca ----------

function pesquisar() {
    const id = document.getElementById('busca-id').value.trim();
    const inicio = document.getElementById('busca-inicio').value;
    const fim = document.getElementById('busca-fim').value;
    const email = document.getElementById('busca-email').value.trim();
    const nome = document.getElementById('busca-nome').value.trim();
    const status = document.getElementById('busca-status').value;
    const funcao = document.getElementById('busca-funcao').value;

    const resultado = listar('usuarios').filter(function (usuario) {
        if (id !== '' && String(usuario.id) !== id) return false;
        if (inicio !== '' && usuario.criadoEm < inicio) return false;
        if (fim !== '' && usuario.criadoEm > fim) return false;
        if (!contem(usuario.email, email)) return false;
        if (!contem(nomeCompleto(usuario), nome)) return false;
        if (status !== '' && usuario.status !== status) return false;
        if (funcao !== '' && usuario.funcao !== funcao) return false;
        return true;
    });

    mostrarUsuarios(resultado);
}

document.getElementById('form-pesquisa').addEventListener('submit', function (evento) {
    evento.preventDefault();
    pesquisar();
});

document.getElementById('limpar-pesquisa').addEventListener('click', function () {
    document.getElementById('form-pesquisa').reset();
    pesquisar();
});

// ---------- visualizar por usuarios / funcao ----------

const botaoUsuarios = document.getElementById('ver-por-usuarios');
const botaoFuncao = document.getElementById('ver-por-funcao');

botaoUsuarios.addEventListener('click', function (evento) {
    evento.preventDefault();
    verPorFuncao = false;
    botaoUsuarios.className = 'tag-ativa';
    botaoFuncao.className = 'tag';
    pesquisar(); // mantem os filtros que estiverem preenchidos
});

botaoFuncao.addEventListener('click', function (evento) {
    evento.preventDefault();
    verPorFuncao = true;
    botaoFuncao.className = 'tag-ativa';
    botaoUsuarios.className = 'tag';
    pesquisar();
});

// ---------- remover e mudar status (usuarios marcados no checkbox) ----------

function pegarMarcados() {
    const marcados = [];
    document.querySelectorAll('#lista-usuarios input[type=checkbox]:checked').forEach(function (caixa) {
        marcados.push(Number(caixa.value));
    });
    return marcados;
}

// checkbox do titulo marca ou desmarca todos
document.getElementById('marcar-todos').addEventListener('change', function () {
    const marcar = this.checked;
    document.querySelectorAll('#lista-usuarios input[type=checkbox]').forEach(function (caixa) {
        caixa.checked = marcar;
    });
});

document.getElementById('botao-remover').addEventListener('click', function () {
    const marcados = pegarMarcados();
    if (marcados.length === 0) {
        mostrarMensagem('Marque pelo menos um usuário pra remover.', 'aviso');
        return;
    }

    // nao deixa o gerente apagar a propria conta
    if (marcados.includes(usuarioAtual.id)) {
        mostrarMensagem('Você não pode remover a sua própria conta.');
        return;
    }

    // quem tem pet cadastrado nao pode ser removido, senao o pet fica sem dono
    const pets = listar('pets');
    const comPet = marcados.filter(function (id) {
        return pets.some(function (pet) { return pet.donoId === id; });
    });
    if (comPet.length > 0) {
        const nomes = comPet.map(function (id) { return nomeCompleto(buscarPorId('usuarios', id)); });
        mostrarMensagem('Não dá pra remover quem tem pet cadastrado: ' + nomes.join(', ') + '. Troque o dono do pet ou apague o pet antes.');
        return;
    }

    if (!confirm('Remover ' + marcados.length + ' usuário(s)?')) {
        return;
    }

    const restantes = listar('usuarios').filter(function (usuario) {
        return !marcados.includes(usuario.id);
    });
    salvar('usuarios', restantes);
    mostrarMensagem(marcados.length + ' usuário(s) removido(s).', 'sucesso');
    pesquisar();
});

// o "Mudar status" abre um painel perguntando se e pra ativar ou desativar
const painelStatus = document.getElementById('painel-status');

document.getElementById('botao-mudar-status').addEventListener('click', function () {
    const marcados = pegarMarcados();
    if (marcados.length === 0) {
        mostrarMensagem('Marque pelo menos um usuário pra mudar o status.', 'aviso');
        return;
    }
    document.getElementById('texto-painel-status').textContent = marcados.length + ' usuário(s) marcado(s). Mudar para:';
    painelStatus.hidden = false;
});

function mudarStatus(novoStatus) {
    let marcados = pegarMarcados();

    // o proprio gerente nao pode se desativar, senao perde o acesso
    let ficouDeFora = '';
    if (novoStatus === 'Inativo' && marcados.includes(usuarioAtual.id)) {
        ficouDeFora = ' A sua conta ficou de fora.';
        marcados = marcados.filter(function (id) { return id !== usuarioAtual.id; });
        if (marcados.length === 0) {
            mostrarMensagem('Você não pode desativar a sua própria conta.');
            painelStatus.hidden = true;
            return;
        }
    }

    const usuarios = listar('usuarios');
    usuarios.forEach(function (usuario) {
        if (marcados.includes(usuario.id)) {
            usuario.status = novoStatus;
        }
    });
    salvar('usuarios', usuarios);

    painelStatus.hidden = true;
    mostrarMensagem(marcados.length + ' usuário(s) agora ' + (novoStatus === 'Ativo' ? 'ativo(s)' : 'inativo(s)') + '.' + ficouDeFora, 'sucesso');
    pesquisar();
}

document.getElementById('status-ativar').addEventListener('click', function () {
    mudarStatus('Ativo');
});
document.getElementById('status-desativar').addEventListener('click', function () {
    mudarStatus('Inativo');
});
document.getElementById('status-cancelar').addEventListener('click', function () {
    painelStatus.hidden = true;
});

configurarOrdenacao(pesquisar);

mostrarUsuarios(listar('usuarios'));
