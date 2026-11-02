// criar-conta.js - tela de criar conta
// a conta nova entra como Cliente e Ativo, e o usuario ja fica logado.

if (pegarUsuarioLogado()) {
    window.location.href = 'reservas.html';
}

configurarVerSenha();

document.getElementById('form-criar-conta').addEventListener('submit', function (evento) {
    evento.preventDefault();

    const email = document.getElementById('login').value.trim().toLowerCase();
    const senha = document.getElementById('senha').value;

    if (email === '' || senha === '') {
        mostrarMensagem('Preencha o email e a senha.');
        return;
    }

    if (!email.includes('@') || !email.includes('.')) {
        mostrarMensagem('Digite um email válido.');
        return;
    }

    if (senha.length < 6) {
        mostrarMensagem('A senha precisa ter pelo menos 6 caracteres.');
        return;
    }

    const usuarios = listar('usuarios');

    const jaExiste = usuarios.find(function (u) {
        return u.email === email;
    });
    if (jaExiste) {
        mostrarMensagem('Já existe uma conta com este email.');
        return;
    }

    const novoUsuario = {
        id: proximoId('usuarios'),
        email: email,
        nome: email.split('@')[0], // nome provisorio: o que vem antes do @
        sobrenome: '',
        telefone: '',
        funcao: 'Cliente',
        status: 'Ativo',
        foto: '',
        criadoEm: dataDeHoje()
    };

    usuarios.push(novoUsuario);
    salvar('usuarios', usuarios);

    fazerLogin(novoUsuario.id, false);
    window.location.href = 'reservas.html';
});
