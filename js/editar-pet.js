// editar-pet.js - carrega o pet no formulario (editar-pet.html?id=...)

const pet = buscarPorId('pets', pegarParametro('id'));

if (!pet) {
    mostrarNaoEncontrado('Pet não encontrado', 'pets.html');
} else {
    preencherSelectUsuarios(document.getElementById('pet-dono'), pet.donoId);

    document.getElementById('pet-dono').value = pet.donoId;
    document.getElementById('pet-nome').value = pet.nome;
    document.getElementById('pet-tipo').value = pet.tipo;
    document.getElementById('pet-raca').value = pet.raca;
    document.getElementById('pet-tamanho').value = pet.tamanho;
    if (pet.foto) {
        document.getElementById('preview-foto').src = pet.foto;
    }
}
