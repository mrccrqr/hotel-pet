// perfil.js
// perfil.html        -> o usuario logado ve e edita o proprio perfil
// perfil.html?id=... -> visualizar outro usuario (vem da lista de usuarios, so leitura)

const id = pegarParametro('id');

let usuario = usuarioAtual;
if (id) {
    usuario = buscarPorId('usuarios', id);
}

if (!usuario) {
    mostrarNaoEncontrado('Usuário não encontrado', 'usuarios.html');
} else {
    document.getElementById('usuario-email').value = usuario.email;
    document.getElementById('usuario-nome').value = usuario.nome;
    document.getElementById('usuario-sobrenome').value = usuario.sobrenome;
    document.getElementById('usuario-telefone').value = usuario.telefone;
    document.getElementById('usuario-funcao').value = usuario.funcao;
    if (usuario.foto) {
        document.getElementById('preview-foto').src = usuario.foto;
    }

    // a funcao so pode ser mudada pela tela de usuarios
    document.getElementById('usuario-funcao').disabled = true;

    // vendo outro usuario: tudo fica so leitura
    if (id && usuario.id !== usuarioAtual.id) {
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
    }
}
