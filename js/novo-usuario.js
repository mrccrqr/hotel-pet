// novo-usuario.js - cadastro de usuario
// a mesma tela serve para editar: novo-usuario.html?id=... carrega o usuario no formulario

const id = pegarParametro('id');
let usuario = null; // fica null quando e cadastro novo
let foto = '';

if (id) {
    usuario = buscarPorId('usuarios', id);

    if (!usuario) {
        mostrarNaoEncontrado('Usuário não encontrado', 'usuarios.html');
    } else {
        // muda os textos da tela de "Novo" para "Editar"
        document.title = 'Hotel Pet - Editar usuário';
        document.getElementById('titulo').textContent = 'Editar usuário';
        document.getElementById('breadcrumb-atual').textContent = 'Editar usuário';

        document.getElementById('usuario-email').value = usuario.email;
        document.getElementById('usuario-nome').value = usuario.nome;
        document.getElementById('usuario-sobrenome').value = usuario.sobrenome;
        document.getElementById('usuario-telefone').value = usuario.telefone;
        document.getElementById('usuario-funcao').value = usuario.funcao;
        foto = usuario.foto;
        if (foto) {
            document.getElementById('preview-foto').src = foto;
        }
    }
}

// so liga os botoes se a tela nao virou "nao encontrado"
if (!id || usuario) {
    document.getElementById('usuario-foto').addEventListener('change', function () {
        if (this.files.length === 0) return;
        lerImagem(this.files[0], function (imagem) {
            foto = imagem;
            document.getElementById('preview-foto').src = imagem;
        });
    });

    document.getElementById('botao-salvar').addEventListener('click', function () {
        const email = document.getElementById('usuario-email').value.trim().toLowerCase();
        const nome = document.getElementById('usuario-nome').value.trim();
        const sobrenome = document.getElementById('usuario-sobrenome').value.trim();
        const telefone = document.getElementById('usuario-telefone').value.trim();
        const funcao = document.getElementById('usuario-funcao').value;

        if (email === '' || nome === '' || telefone === '') {
            mostrarMensagem('Preencha todos os campos com *.');
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            mostrarMensagem('Digite um email válido.');
            return;
        }

        const usuarios = listar('usuarios');

        // nao pode ter dois usuarios com o mesmo email (tirando ele mesmo quando ta editando)
        const repetido = usuarios.find(function (u) {
            return u.email === email && (!usuario || u.id !== usuario.id);
        });
        if (repetido) {
            mostrarMensagem('Já existe um usuário com esse email.');
            return;
        }

        if (usuario) {
            // editando: troca os dados e mantem status e data de criacao
            usuarios.forEach(function (u) {
                if (u.id === usuario.id) {
                    u.email = email;
                    u.nome = nome;
                    u.sobrenome = sobrenome;
                    u.telefone = telefone;
                    u.funcao = funcao;
                    u.foto = foto;
                }
            });
        } else {
            usuarios.push({
                id: proximoId('usuarios'),
                email: email,
                nome: nome,
                sobrenome: sobrenome,
                telefone: telefone,
                funcao: funcao,
                status: 'Ativo',
                foto: foto,
                criadoEm: dataDeHoje()
            });
        }

        if (salvar('usuarios', usuarios)) {
            avisarNaProximaTela(usuario ? 'Usuário salvo!' : 'Usuário cadastrado!');
            window.location.href = 'usuarios.html';
        }
    });

    document.getElementById('botao-limpar').addEventListener('click', function () {
        document.getElementById('form-usuario').reset();
        document.getElementById('preview-foto').src = 'img/avatar.png';
        foto = '';
    });
}
