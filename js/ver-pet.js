// ver-pet.js - mostra um pet e as reservas dele (ver-pet.html?id=...)

const pet = buscarPorId('pets', pegarParametro('id'));

if (!pet) {
    mostrarNaoEncontrado('Pet não encontrado', 'pets.html');
} else {
    const dono = buscarPorId('usuarios', pet.donoId);

    document.getElementById('link-editar').href = 'editar-pet.html?id=' + pet.id;

    document.getElementById('ver-proprietario').innerHTML = '<a href="perfil.html?id=' + dono.id + '">' + nomeCompleto(dono) + '</a>';
    document.getElementById('ver-id').textContent = pet.id;
    document.getElementById('ver-nome').textContent = pet.nome;
    document.getElementById('ver-tipo').textContent = pet.tipo;
    document.getElementById('ver-raca').textContent = pet.raca;
    document.getElementById('ver-tamanho').textContent = pet.tamanho;
    if (pet.foto) {
        document.getElementById('ver-foto').src = pet.foto;
    }

    // reservas desse pet
    const reservasDoPet = listar('reservas').filter(function (reserva) {
        return reserva.petId === pet.id;
    });

    const lista = document.getElementById('ver-reservas');

    if (reservasDoPet.length === 0) {
        lista.textContent = 'Nenhuma reserva.';
    }

    reservasDoPet.forEach(function (reserva) {
        // no Figma a reserva finalizada aparece como "completa"
        let texto = reserva.status.toLowerCase();
        if (reserva.status === 'Finalizada') {
            texto = 'completa';
        }

        lista.innerHTML +=
            '<p class="reserva-item ' + classeStatus(reserva.status) + '">' +
                '<a href="ver-reserva.html?id=' + reserva.id + '">' +
                    formatarData(reserva.chegada) + ' - ' + formatarData(reserva.partida) + ' (' + texto + ')' +
                '</a>' +
            '</p>';
    });

    // deletar apaga o pet e todas as reservas dele junto
    document.getElementById('botao-deletar').addEventListener('click', function (evento) {
        evento.preventDefault();

        let pergunta = 'Deletar o pet ' + pet.nome + '?';
        if (reservasDoPet.length > 0) {
            pergunta += '\nAs ' + reservasDoPet.length + ' reserva(s) dele também vão ser apagadas.';
        }
        if (!confirm(pergunta)) {
            return;
        }

        const pets = listar('pets').filter(function (item) {
            return item.id !== pet.id;
        });
        const reservas = listar('reservas').filter(function (reserva) {
            return reserva.petId !== pet.id;
        });
        salvar('pets', pets);
        salvar('reservas', reservas);

        avisarNaProximaTela('Pet ' + pet.nome + ' deletado.');
        window.location.href = 'pets.html';
    });
}
