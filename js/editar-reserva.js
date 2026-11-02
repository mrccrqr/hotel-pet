// editar-reserva.js - carrega a reserva no formulario (editar-reserva.html?id=...)

const reserva = buscarPorId('reservas', pegarParametro('id'));

if (!reserva) {
    mostrarNaoEncontrado('Reserva não encontrada', 'reservas.html');
} else {
    preencherSelectPets(document.getElementById('reserva-pet'));

    document.getElementById('reserva-pet').value = reserva.petId;
    document.getElementById('reserva-chegada').value = reserva.chegada;
    document.getElementById('reserva-partida').value = reserva.partida;
    document.getElementById('reserva-notas').value = reserva.notas;
    document.getElementById('reserva-status').value = reserva.status;
    document.getElementById('reserva-anotacoes').value = reserva.anotacoes;
    document.getElementById('reserva-total').textContent = formatarMoeda(reserva.total);

    mostrarProprietario();

    // se trocar o pet, o proprietario muda junto
    document.getElementById('reserva-pet').addEventListener('change', mostrarProprietario);

    // imagens da estadia, antes do botao "+"
    const botaoMais = document.getElementById('add-imagem');
    reserva.imagens.forEach(function (imagem) {
        botaoMais.insertAdjacentHTML('beforebegin', '<img src="' + imagem + '" alt="Imagem da estadia">');
    });
}

// o proprietario e sempre o dono do pet escolhido
function mostrarProprietario() {
    const pet = buscarPorId('pets', document.getElementById('reserva-pet').value);
    const dono = buscarPorId('usuarios', pet.donoId);
    document.getElementById('reserva-proprietario').value = nomeCompleto(dono);
}
