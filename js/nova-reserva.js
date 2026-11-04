// nova-reserva.js - fazer reserva

preencherSelectPets(document.getElementById('reserva-pet'));

const campoChegada = document.getElementById('reserva-chegada');
const campoPartida = document.getElementById('reserva-partida');

// o total muda sozinho quando escolhe as datas (diarias x valor da diaria das configuracoes)
function atualizarTotal() {
    let total = 0;
    if (campoChegada.value && campoPartida.value && campoPartida.value > campoChegada.value) {
        total = calcularTotal(campoChegada.value, campoPartida.value);
    }
    document.getElementById('reserva-total').textContent = formatarMoeda(total);
}

campoChegada.addEventListener('change', atualizarTotal);
campoPartida.addEventListener('change', atualizarTotal);

document.getElementById('botao-salvar').addEventListener('click', function () {
    const petId = Number(document.getElementById('reserva-pet').value);
    const chegada = campoChegada.value;
    const partida = campoPartida.value;

    if (!petId || chegada === '' || partida === '') {
        mostrarMensagem('Escolha o pet e o período.');
        return;
    }

    if (partida <= chegada) {
        mostrarMensagem('A partida tem que ser depois da chegada.');
        return;
    }

    const lotado = diaSemVaga(chegada, partida, null);
    if (lotado) {
        mostrarMensagem('Não tem vaga no dia ' + formatarData(lotado) + '. Todas as ' + pegarConfiguracoes().vagas + ' vagas estão ocupadas.');
        return;
    }

    const reserva = {
        id: proximoId('reservas'),
        petId: petId,
        chegada: chegada,
        partida: partida,
        status: 'Reservada',
        total: calcularTotal(chegada, partida),
        notas: document.getElementById('reserva-notas').value.trim(),
        anotacoes: '',
        imagens: [],
        recibo: '',
        criadoEm: dataDeHoje(),
        atualizadoEm: dataDeHoje()
    };

    const reservas = listar('reservas');
    reservas.push(reserva);
    if (salvar('reservas', reservas)) {
        avisarNaProximaTela('Reserva feita!');
        window.location.href = 'ver-reserva.html?id=' + reserva.id;
    }
});

document.getElementById('botao-limpar').addEventListener('click', function () {
    document.getElementById('form-reserva').reset();
    atualizarTotal();
});
