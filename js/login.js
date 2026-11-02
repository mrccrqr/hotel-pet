// login.js - tela de login (index.html)
// como nao tem backend, a senha nao e conferida.
// basta o email existir na lista de usuarios e o usuario estar Ativo.

// se ja estiver logado vai direto para as reservas
if (pegarUsuarioLogado()) {
    window.location.href = 'reservas.html';
}

configurarVerSenha();

document.getElementById('form-login').addEventListener('submit', function (evento) {
    evento.preventDefault(); // nao deixa a pagina recarregar

    const email = document.getElementById('login').value.trim().toLowerCase();
    const senha = document.getElementById('senha').value;
    const manterConectado = document.getElementById('manter-conectado').checked;

    if (email === '' || senha === '') {
        mostrarMensagem('Preencha o email e a senha.');
        return;
    }

    const usuario = listar('usuarios').find(function (u) {
        return u.email === email;
    });

    if (!usuario) {
        mostrarMensagem('Email não cadastrado.');
        return;
    }

    if (usuario.status !== 'Ativo') {
        mostrarMensagem('Este usuário está inativo. Fale com um gerente.');
        return;
    }

    fazerLogin(usuario.id, manterConectado);
    window.location.href = 'reservas.html';
});

document.getElementById('esqueci-senha').addEventListener('click', function (evento) {
    evento.preventDefault();
    mostrarMensagem('O sistema não tem servidor, então a senha não é conferida. Entre com seu email e qualquer senha.', 'aviso');
});

document.querySelectorAll('.social').forEach(function (link) {
    link.addEventListener('click', function (evento) {
        evento.preventDefault();
        mostrarMensagem('Login por rede social ainda não está disponível.', 'aviso');
    });
});
