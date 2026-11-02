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

mostrarReservas(listar('reservas'));
