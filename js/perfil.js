// perfil.js
// perfil.html        -> o usuario logado ve e edita o proprio perfil
// perfil.html?id=... -> visualizar outro usuario (vem da lista de usuarios, so leitura)

const id = pegarParametro('id');

let usuario = usuarioAtual;
if (id) {
    usuario = buscarPorId('usuarios', id);
}

let foto = '';

if (!usuario) {
    mostrarNaoEncontrado('Usuário não encontrado', 'usuarios.html');
} else {
    document.getElementById('usuario-email').value = usuario.email;
    document.getElementById('usuario-nome').value = usuario.nome;
    document.getElementById('usuario-sobrenome').value = usuario.sobrenome;
    document.getElementById('usuario-telefone').value = usuario.telefone;
    document.getElementById('usuario-funcao').value = usuario.funcao;
    foto = usuario.foto;
    if (foto) {
        document.getElementById('preview-foto').src = foto;
    }

    // a funcao so pode ser mudada pela tela de usuarios
    document.getElementById('usuario-funcao').disabled = true;

    if (id && usuario.id !== usuarioAtual.id) {
        // vendo outro usuario: tudo fica so leitura
        document.title = 'Hotel Pet - Ver usuário';
        document.getElementById('titulo').textContent = 'Ver usuário';
        document.getElementById('breadcrumb-atual').innerHTML = '<a href="usuarios.html">Usuários</a> / Ver usuário';
        document.querySelector('.menu-lateral a[href="usuarios.html"]').classList.add('ativo');

        document.querySelectorAll('#form-usuario input').forEach(function (campo) {
            campo.disabled = true;
        });
        document.getElementById('usuario-foto').hidden = true;

        // no lugar de Salvar e Limpar, mostra Editar e Voltar
        document.querySelector('.form-botoes').innerHTML =
            '<a href="novo-usuario.html?id=' + usuario.id + '" class="botao-salvar">Editar</a>' +
            '<a href="usuarios.html" class="botao-limpar">← Voltar</a>';
    } else {
        // o proprio perfil: da pra salvar
        document.getElementById('usuario-foto').addEventListener('change', function () {
            if (this.files.length === 0) return;
            lerImagem(this.files[0], function (imagem) {
                foto = imagem;
                document.getElementById('preview-foto').src = imagem;
            });
        });

        document.getElementById('botao-salvar').addEventListener('click', salvarPerfil);

        document.getElementById('botao-limpar').addEventListener('click', function () {
            // a funcao nao e apagada porque nao da pra mudar aqui
            document.getElementById('usuario-email').value = '';
            document.getElementById('usuario-nome').value = '';
            document.getElementById('usuario-sobrenome').value = '';
            document.getElementById('usuario-telefone').value = '';
            document.getElementById('usuario-foto').value = '';
            document.getElementById('preview-foto').src = 'img/avatar.png';
            foto = '';
        });
    }
}

function salvarPerfil() {
    const email = document.getElementById('usuario-email').value.trim().toLowerCase();
    const nome = document.getElementById('usuario-nome').value.trim();
    const sobrenome = document.getElementById('usuario-sobrenome').value.trim();
    const telefone = document.getElementById('usuario-telefone').value.trim();

    if (email === '' || nome === '' || telefone === '') {
        mostrarMensagem('Preencha todos os campos com *.');
        return;
    }

    if (!email.includes('@') || !email.includes('.')) {
        mostrarMensagem('Digite um email válido.');
        return;
    }

    const usuarios = listar('usuarios');

    const repetido = usuarios.find(function (u) {
        return u.email === email && u.id !== usuario.id;
    });
    if (repetido) {
        mostrarMensagem('Já existe outro usuário com esse email.');
        return;
    }

    usuarios.forEach(function (u) {
        if (u.id === usuario.id) {
            u.email = email;
            u.nome = nome;
            u.sobrenome = sobrenome;
            u.telefone = telefone;
            u.foto = foto;
        }
    });

    if (salvar('usuarios', usuarios)) {
        // recarrega a pagina pra atualizar o nome e a foto do topo tambem
        avisarNaProximaTela('Perfil salvo!');
        window.location.href = 'perfil.html';
    }
}
