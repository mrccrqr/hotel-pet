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

// ---------- busca ----------

function pesquisar() {
    const id = document.getElementById('busca-id').value.trim();
    const raca = document.getElementById('busca-raca').value.trim();
    const nome = document.getElementById('busca-nome').value.trim();
    const tamanho = document.getElementById('busca-tamanho').value;

    const resultado = listar('pets').filter(function (pet) {
        if (id !== '' && String(pet.id) !== id) return false;
        if (!contem(pet.raca, raca)) return false;
        if (!contem(pet.nome, nome)) return false;
        if (tamanho !== '' && pet.tamanho !== tamanho) return false;
        return true;
    });

    mostrarPets(resultado);
}

document.getElementById('form-pesquisa').addEventListener('submit', function (evento) {
    evento.preventDefault();
    pesquisar();
});

document.getElementById('limpar-pesquisa').addEventListener('click', function () {
    document.getElementById('form-pesquisa').reset();
    mostrarPets(listar('pets'));
});

mostrarPets(listar('pets'));
