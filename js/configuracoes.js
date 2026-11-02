// configuracoes.js - valor da diaria e numero de vagas

const configuracoes = pegarConfiguracoes();

document.getElementById('config-diaria').value = formatarMoeda(configuracoes.diaria);
document.getElementById('config-vagas').value = configuracoes.vagas;
