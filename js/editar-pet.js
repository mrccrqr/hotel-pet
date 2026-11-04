// editar-pet.js - edita um pet (editar-pet.html?id=...)

const pet = buscarPorId('pets', pegarParametro('id'));
let foto = '';

if (!pet) {
    mostrarNaoEncontrado('Pet não encontrado', 'pets.html');
} else {
    preencherSelectUsuarios(document.getElementById('pet-dono'), pet.donoId);

    document.getElementById('pet-dono').value = pet.donoId;
    document.getElementById('pet-nome').value = pet.nome;
    document.getElementById('pet-tipo').value = pet.tipo;
    document.getElementById('pet-raca').value = pet.raca;
    document.getElementById('pet-tamanho').value = pet.tamanho;
    foto = pet.foto;
    if (foto) {
        document.getElementById('preview-foto').src = foto;
    }

    document.getElementById('pet-foto').addEventListener('change', function () {
        if (this.files.length === 0) return;
        lerImagem(this.files[0], function (imagem) {
            foto = imagem;
            document.getElementById('preview-foto').src = imagem;
        });
    });

    document.getElementById('botao-salvar').addEventListener('click', function () {
        pet.donoId = Number(document.getElementById('pet-dono').value);
        pet.nome = document.getElementById('pet-nome').value.trim();
        pet.tipo = document.getElementById('pet-tipo').value;
        pet.raca = document.getElementById('pet-raca').value.trim();
        pet.tamanho = document.getElementById('pet-tamanho').value;
        pet.foto = foto;

        if (!pet.donoId || pet.nome === '' || pet.tipo === '' || pet.raca === '' || pet.tamanho === '') {
            mostrarMensagem('Preencha todos os campos com *.');
            return;
        }

        // troca o pet antigo pelo editado na lista
        const pets = listar('pets').map(function (item) {
            return item.id === pet.id ? pet : item;
        });
        if (salvar('pets', pets)) {
            avisarNaProximaTela('Pet salvo!');
            window.location.href = 'ver-pet.html?id=' + pet.id;
        }
    });

    // limpar deixa os campos vazios, igual no cadastro
    document.getElementById('botao-limpar').addEventListener('click', function () {
        document.getElementById('form-pet').reset();
        document.getElementById('preview-foto').src = 'img/placeholder.png';
        foto = '';
    });
}
