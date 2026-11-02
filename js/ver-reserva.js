// ver-reserva.js - mostra uma reserva (ver-reserva.html?id=...)

const reserva = buscarPorId('reservas', pegarParametro('id'));

if (!reserva) {
    mostrarNaoEncontrado('Reserva não encontrada', 'reservas.html');
} else {
    const pet = buscarPorId('pets', reserva.petId);
    const dono = buscarPorId('usuarios', pet.donoId);

    document.getElementById('link-editar').href = 'editar-reserva.html?id=' + reserva.id;

    document.getElementById('ver-id').textContent = reserva.id;
    document.getElementById('ver-proprietario').textContent = nomeCompleto(dono);
    document.getElementById('ver-pet').innerHTML = '<a href="ver-pet.html?id=' + pet.id + '">' + pet.nome + '</a>';
    document.getElementById('ver-chegada').textContent = formatarData(reserva.chegada);
    document.getElementById('ver-partida').textContent = formatarData(reserva.partida);
    document.getElementById('ver-notas').textContent = reserva.notas || '-';
    document.getElementById('ver-anotacoes').textContent = reserva.anotacoes || '-';
    document.getElementById('ver-status').innerHTML = '<span class="status ' + classeStatus(reserva.status) + '">' + reserva.status + '</span>';
    document.getElementById('ver-total').textContent = formatarMoeda(reserva.total);
    document.getElementById('ver-criado').textContent = formatarData(reserva.criadoEm);
    document.getElementById('ver-atualizado').textContent = formatarData(reserva.atualizadoEm);

    // imagens postadas pelos funcionarios (se nao tiver, esconde a linha)
    if (reserva.imagens.length === 0) {
        document.getElementById('linha-imagens').hidden = true;
    } else {
        reserva.imagens.forEach(function (imagem) {
            document.getElementById('ver-imagens').innerHTML +=
                '<img src="' + imagem + '" alt="Imagem da estadia" class="img-reserva">';
        });
    }

    // o recibo so aparece se a reserva estiver finalizada e tiver recibo
    if (reserva.status === 'Finalizada' && reserva.recibo) {
        document.getElementById('ver-recibo').innerHTML =
            '<a href="' + reserva.recibo + '" download="recibo">recibo</a>';
    } else {
        document.getElementById('linha-recibo').hidden = true;
    }
}
