// pets.js - lista de pets

function mostrarPets(pets) {
    const tabela = document.getElementById('lista-pets');
    tabela.innerHTML = '';

    pets.forEach(function (pet) {
        tabela.innerHTML +=
            '<tr>' +
                '<td><input type="checkbox" value="' + pet.id + '"></td>' +
                '<td>' + pet.id + '</td>' +
                '<td>' + pet.nome + '</td>' +
                '<td>' + pet.tipo + '</td>' +
                '<td>' + pet.raca + '</td>' +
                '<td>' + pet.tamanho + '</td>' +
                '<td>' +
                    '<a href="editar-pet.html?id=' + pet.id + '">Editar</a> ' +
                    '<a href="ver-pet.html?id=' + pet.id + '">Visualizar</a>' +
                '</td>' +
            '</tr>';
    });

    document.getElementById('lista-vazia').hidden = pets.length > 0;
}

mostrarPets(listar('pets'));
