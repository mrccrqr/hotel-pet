// novo-usuario.js - cadastro de usuario
// a mesma tela serve para editar: novo-usuario.html?id=... carrega o usuario no formulario

const id = pegarParametro('id');

if (id) {
    const usuario = buscarPorId('usuarios', id);

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
        if (usuario.foto) {
            document.getElementById('preview-foto').src = usuario.foto;
        }
    }
}
