// reservas.js - lista de reservas

function mostrarReservas(reservas) {
    const tabela = document.getElementById('lista-reservas');
    tabela.innerHTML = '';

    reservas.forEach(function (reserva) {
        const pet = buscarPorId('pets', reserva.petId);

        let colunaPet = '(pet removido)';
        if (pet) {
            colunaPet = '<a href="ver-pet.html?id=' + pet.id + '">' + pet.nome + '</a>';
        }

        tabela.innerHTML +=
            '<tr>' +
                '<td><input type="checkbox" value="' + reserva.id + '"></td>' +
                '<td>' + reserva.id + '</td>' +
                '<td>' + colunaPet + '</td>' +
                '<td>' + formatarData(reserva.chegada) + '</td>' +
                '<td>' + formatarData(reserva.partida) + '</td>' +
                '<td><span class="status ' + classeStatus(reserva.status) + '">' + reserva.status + '</span></td>' +
                '<td>' + formatarMoeda(reserva.total) + '</td>' +
                '<td>' +
                    '<a href="editar-reserva.html?id=' + reserva.id + '">Editar</a> ' +
                    '<a href="ver-reserva.html?id=' + reserva.id + '">Visualizar</a>' +
                '</td>' +
            '</tr>';
    });

    // mostra "Nenhuma reserva encontrada" quando a lista esta vazia
    document.getElementById('lista-vazia').hidden = reservas.length > 0;
}

// ---------- busca ----------

function pesquisar() {
    const id = document.getElementById('busca-id').value.trim();
    const inicio = document.getElementById('busca-inicio').value;
    const fim = document.getElementById('busca-fim').value;
    const proprietario = document.getElementById('busca-proprietario').value.trim();
    const totalMin = lerValor(document.getElementById('busca-total-min').value);
    const totalMax = lerValor(document.getElementById('busca-total-max').value);
    const status = document.getElementById('busca-status').value;
    const nomePet = document.getElementById('busca-pet').value.trim();

    const resultado = listar('reservas').filter(function (reserva) {
        const pet = buscarPorId('pets', reserva.petId);
        const dono = buscarPorId('usuarios', pet.donoId);

        if (id !== '' && String(reserva.id) !== id) return false;

        // periodo: mostra as reservas que pegam pelo menos um dia entre o inicio e o fim
        // (as datas estao no formato 2026-11-10, entao da pra comparar como texto)
        if (inicio !== '' && reserva.partida < inicio) return false;
        if (fim !== '' && reserva.chegada > fim) return false;

        if (!contem(nomeCompleto(dono), proprietario)) return false;
        if (totalMin !== null && reserva.total < totalMin) return false;
        if (totalMax !== null && reserva.total > totalMax) return false;
        if (status !== '' && reserva.status !== status) return false;
        if (!contem(pet.nome, nomePet)) return false;

        return true;
    });

    mostrarReservas(resultado);
}

// o "Pesquisar" e o botao submit do form, entao o Enter tambem pesquisa
document.getElementById('form-pesquisa').addEventListener('submit', function (evento) {
    evento.preventDefault();
    pesquisar();
});

document.getElementById('limpar-pesquisa').addEventListener('click', function () {
    document.getElementById('form-pesquisa').reset();
    mostrarReservas(listar('reservas'));
});

mostrarReservas(listar('reservas'));
