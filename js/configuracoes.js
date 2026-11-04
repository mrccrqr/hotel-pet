// configuracoes.js - valor da diaria e numero de vagas

const configuracoes = pegarConfiguracoes();

document.getElementById('config-diaria').value = formatarMoeda(configuracoes.diaria);
document.getElementById('config-vagas').value = configuracoes.vagas;

document.getElementById('botao-salvar').addEventListener('click', function () {
    const diaria = lerValor(document.getElementById('config-diaria').value);
    const vagas = Number(document.getElementById('config-vagas').value.trim());

    if (diaria === null || diaria <= 0) {
        mostrarMensagem('Digite um valor de diária válido, ex: R$ 10,00');
        return;
    }

    // vagas tem que ser numero inteiro, 1 ou mais
    if (!Number.isInteger(vagas) || vagas < 1) {
        mostrarMensagem('O número de vagas tem que ser um número inteiro maior que zero.');
        return;
    }

    salvar('configuracoes', { diaria: diaria, vagas: vagas });

    // mostra o valor ja formatado do jeito certo
    document.getElementById('config-diaria').value = formatarMoeda(diaria);
    mostrarMensagem('Configurações salvas! As reservas novas já usam o valor novo da diária.', 'sucesso');
});

document.getElementById('botao-limpar').addEventListener('click', function () {
    document.getElementById('form-configuracoes').reset();
});
