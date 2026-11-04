// editar-reserva.js - edita uma reserva (editar-reserva.html?id=...)
// igual no Figma, os campos mudam com o status:
//   Em andamento -> aparecem as anotacoes do funcionario e as imagens
//   Finalizada   -> aparece o botao de adicionar a nota fiscal (recibo)
// o gerente pode editar ate reserva finalizada

const reserva = buscarPorId('reservas', pegarParametro('id'));

let imagens = [];
let recibo = '';

if (!reserva) {
    mostrarNaoEncontrado('Reserva não encontrada', 'reservas.html');
} else {
    imagens = reserva.imagens.slice(); // copia, so salva de verdade no Salvar
    recibo = reserva.recibo;

    preencherSelectPets(document.getElementById('reserva-pet'));

    document.getElementById('reserva-pet').value = reserva.petId;
    document.getElementById('reserva-chegada').value = reserva.chegada;
    document.getElementById('reserva-partida').value = reserva.partida;
    document.getElementById('reserva-notas').value = reserva.notas;
    document.getElementById('reserva-status').value = reserva.status;
    document.getElementById('reserva-anotacoes').value = reserva.anotacoes;

    mostrarProprietario();
    mostrarTotal();
    mostrarCamposDoStatus();
    mostrarImagens();
    mostrarRecibo();

    document.getElementById('reserva-pet').addEventListener('change', mostrarProprietario);
    document.getElementById('reserva-chegada').addEventListener('change', mostrarTotal);
    document.getElementById('reserva-partida').addEventListener('change', mostrarTotal);
    document.getElementById('reserva-status').addEventListener('change', mostrarCamposDoStatus);

    // o "+" abre o seletor de arquivo que fica escondido
    document.getElementById('add-imagem').addEventListener('click', function (evento) {
        evento.preventDefault();
        document.getElementById('input-imagem').click();
    });

    document.getElementById('input-imagem').addEventListener('change', function () {
        if (this.files.length === 0) return;
        lerImagem(this.files[0], function (imagem) {
            imagens.push(imagem);
            mostrarImagens();
        });
        this.value = ''; // deixa escolher a mesma imagem de novo se quiser
    });

    document.getElementById('botao-nota').addEventListener('click', function () {
        document.getElementById('input-recibo').click();
    });

    document.getElementById('input-recibo').addEventListener('change', function () {
        if (this.files.length === 0) return;
        const arquivo = this.files[0];
        // pdf nao da pra diminuir, entao limito o tamanho pra nao encher o localStorage
        if (arquivo.size > 1024 * 1024) {
            mostrarMensagem('O arquivo da nota é muito grande (máximo 1MB).');
            return;
        }
        const leitor = new FileReader();
        leitor.onload = function () {
            recibo = leitor.result;
            mostrarRecibo();
        };
        leitor.readAsDataURL(arquivo);
    });

    document.getElementById('botao-salvar').addEventListener('click', salvarReserva);

    // limpar esvazia os campos (as imagens e o recibo ficam, da pra tirar eles separado)
    document.getElementById('botao-limpar').addEventListener('click', function () {
        document.getElementById('form-reserva').reset();
        mostrarProprietario();
        mostrarTotal();
        mostrarCamposDoStatus();
    });
}

// o proprietario e sempre o dono do pet escolhido
function mostrarProprietario() {
    const pet = buscarPorId('pets', document.getElementById('reserva-pet').value);
    let nome = '';
    if (pet) {
        nome = nomeCompleto(buscarPorId('usuarios', pet.donoId));
    }
    document.getElementById('reserva-proprietario').value = nome;
}

// se as datas nao mudaram, mantem o total que ja estava salvo
// (pra nao mudar o valor de reserva antiga quando a diaria muda nas configuracoes)
function pegarTotal() {
    const chegada = document.getElementById('reserva-chegada').value;
    const partida = document.getElementById('reserva-partida').value;
    if (chegada === reserva.chegada && partida === reserva.partida) {
        return reserva.total;
    }
    if (chegada && partida && partida > chegada) {
        return calcularTotal(chegada, partida);
    }
    return 0;
}

function mostrarTotal() {
    document.getElementById('reserva-total').textContent = formatarMoeda(pegarTotal());
}

function mostrarCamposDoStatus() {
    const status = document.getElementById('reserva-status').value;
    document.getElementById('area-andamento').hidden = status !== 'Em andamento';
    document.getElementById('area-finalizada').hidden = status !== 'Finalizada';
}

function mostrarImagens() {
    const caixa = document.getElementById('reserva-imagens');
    caixa.querySelectorAll('img').forEach(function (img) {
        img.remove();
    });

    const botaoMais = document.getElementById('add-imagem');
    imagens.forEach(function (imagem, posicao) {
        const img = document.createElement('img');
        img.src = imagem;
        img.alt = 'Imagem da estadia';
        img.title = 'Clique para remover';
        img.className = 'img-removivel';
        img.addEventListener('click', function () {
            if (confirm('Remover esta imagem?')) {
                imagens.splice(posicao, 1);
                mostrarImagens();
            }
        });
        caixa.insertBefore(img, botaoMais);
    });
}

function mostrarRecibo() {
    const area = document.getElementById('recibo-atual');
    if (recibo) {
        area.innerHTML = 'Nota: <a href="' + recibo + '" download="recibo">recibo</a> <a href="#" id="tirar-recibo">(tirar)</a>';
        document.getElementById('tirar-recibo').addEventListener('click', function (evento) {
            evento.preventDefault();
            recibo = '';
            mostrarRecibo();
        });
    } else {
        area.textContent = 'Nenhuma nota adicionada.';
    }
}

function salvarReserva() {
    const petId = Number(document.getElementById('reserva-pet').value);
    const chegada = document.getElementById('reserva-chegada').value;
    const partida = document.getElementById('reserva-partida').value;
    const status = document.getElementById('reserva-status').value;

    if (!petId || chegada === '' || partida === '') {
        mostrarMensagem('Escolha o pet e o período.');
        return;
    }

    if (partida <= chegada) {
        mostrarMensagem('A partida tem que ser depois da chegada.');
        return;
    }

    // so confere vaga se a reserva continuar ocupando lugar no hotel
    if (status === 'Reservada' || status === 'Em andamento') {
        const lotado = diaSemVaga(chegada, partida, reserva.id);
        if (lotado) {
            mostrarMensagem('Não tem vaga no dia ' + formatarData(lotado) + '. Todas as ' + pegarConfiguracoes().vagas + ' vagas estão ocupadas.');
            return;
        }
    }

    reserva.total = pegarTotal();
    reserva.petId = petId;
    reserva.chegada = chegada;
    reserva.partida = partida;
    reserva.status = status;
    reserva.notas = document.getElementById('reserva-notas').value.trim();
    reserva.anotacoes = document.getElementById('reserva-anotacoes').value.trim();
    reserva.imagens = imagens;
    reserva.recibo = recibo;
    reserva.atualizadoEm = dataDeHoje();

    const reservas = listar('reservas').map(function (item) {
        return item.id === reserva.id ? reserva : item;
    });
    if (salvar('reservas', reservas)) {
        avisarNaProximaTela('Reserva salva!');
        window.location.href = 'ver-reserva.html?id=' + reserva.id;
    }
}
