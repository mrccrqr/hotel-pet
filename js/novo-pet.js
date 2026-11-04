// novo-pet.js - cadastro de pet

preencherSelectUsuarios(document.getElementById('pet-dono'));

let foto = ''; // foto escolhida, ja diminuida (fica vazia se nao escolher)

document.getElementById('pet-foto').addEventListener('change', function () {
    if (this.files.length === 0) return;
    lerImagem(this.files[0], function (imagem) {
        foto = imagem;
        document.getElementById('preview-foto').src = imagem;
    });
});

document.getElementById('botao-salvar').addEventListener('click', function () {
    const pet = {
        id: proximoId('pets'),
        donoId: Number(document.getElementById('pet-dono').value),
        nome: document.getElementById('pet-nome').value.trim(),
        tipo: document.getElementById('pet-tipo').value,
        raca: document.getElementById('pet-raca').value.trim(),
        tamanho: document.getElementById('pet-tamanho').value,
        foto: foto
    };

    if (!pet.donoId || pet.nome === '' || pet.tipo === '' || pet.raca === '' || pet.tamanho === '') {
        mostrarMensagem('Preencha todos os campos com *.');
        return;
    }

    const pets = listar('pets');
    pets.push(pet);
    if (salvar('pets', pets)) {
        avisarNaProximaTela('Pet cadastrado!');
        window.location.href = 'ver-pet.html?id=' + pet.id;
    }
});

document.getElementById('botao-limpar').addEventListener('click', function () {
    document.getElementById('form-pet').reset();
    document.getElementById('preview-foto').src = 'img/placeholder.png';
    foto = '';
});
