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

mostrarUsuarios(listar('usuarios'));
