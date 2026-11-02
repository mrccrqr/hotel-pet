// usuarios.js - lista de usuarios

function mostrarUsuarios(usuarios) {
    const tabela = document.getElementById('lista-usuarios');
    tabela.innerHTML = '';

    usuarios.forEach(function (usuario) {
        // quem nao tem foto aparece com o avatar padrao
        const foto = usuario.foto || 'img/avatar.png';

        tabela.innerHTML +=
            '<tr>' +
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
    });

    document.getElementById('lista-vazia').hidden = usuarios.length > 0;
}

mostrarUsuarios(listar('usuarios'));
