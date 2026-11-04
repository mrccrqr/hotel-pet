// dados.js
// Como nao tem backend, os dados ficam salvos no localStorage do navegador.
// Na primeira vez que o site abre, o localStorage e preenchido com os dados abaixo.

const usuariosIniciais = [
    { id: 1, email: 'joaodasilva@pet.com', nome: 'João', sobrenome: 'da Silva', telefone: '+55 (73) 99876-8943', funcao: 'Gerente', status: 'Ativo', foto: '', criadoEm: '2020-02-19' },
    { id: 2, email: 'maria@pet.com', nome: 'Maria', sobrenome: 'da Silva', telefone: '+55 (73) 98812-4471', funcao: 'Funcionário', status: 'Inativo', foto: '', criadoEm: '2020-02-19' },
    { id: 3, email: 'josedasilva@pet.com', nome: 'José', sobrenome: 'da Silva', telefone: '+55 (77) 99134-5520', funcao: 'Cliente', status: 'Ativo', foto: '', criadoEm: '2020-02-19' },
    { id: 4, email: 'iara@pet.com', nome: 'Iara', sobrenome: 'Monteiro', telefone: '+55 (77) 98105-3327', funcao: 'Cliente', status: 'Ativo', foto: '', criadoEm: '2025-03-11' },
    { id: 5, email: 'caetano@pet.com', nome: 'Caetano', sobrenome: 'Lobo', telefone: '+55 (71) 99620-1184', funcao: 'Cliente', status: 'Ativo', foto: '', criadoEm: '2025-08-27' },
    { id: 6, email: 'benedita@pet.com', nome: 'Benedita', sobrenome: 'Queiroz', telefone: '+55 (77) 99457-0912', funcao: 'Funcionário', status: 'Ativo', foto: '', criadoEm: '2024-06-05' },
    { id: 7, email: 'otavio@pet.com', nome: 'Otávio', sobrenome: 'Brandão', telefone: '+55 (73) 98233-6650', funcao: 'Cliente', status: 'Inativo', foto: '', criadoEm: '2023-11-14' }
];

const petsIniciais = [
    { id: 1, donoId: 3, nome: 'Max', tipo: 'Cachorro', raca: 'Pastor Alemão', tamanho: 'Grande', foto: '' },
    { id: 2, donoId: 3, nome: 'Ginger', tipo: 'Gato', raca: 'Não definida', tamanho: 'Pequeno', foto: '' },
    { id: 3, donoId: 4, nome: 'Paçoca', tipo: 'Cachorro', raca: 'Vira-lata', tamanho: 'Médio', foto: '' },
    { id: 4, donoId: 4, nome: 'Jabuticaba', tipo: 'Gato', raca: 'Siamês', tamanho: 'Pequeno', foto: '' },
    { id: 5, donoId: 5, nome: 'Tenente', tipo: 'Cachorro', raca: 'Labrador', tamanho: 'Grande', foto: '' },
    { id: 6, donoId: 7, nome: 'Pipoca', tipo: 'Cachorro', raca: 'Shih-tzu', tamanho: 'Pequeno', foto: '' }
];

const reservasIniciais = [
    { id: 1, petId: 1, chegada: '2026-11-10', partida: '2026-11-14', status: 'Reservada', total: 40, notas: '', anotacoes: '', imagens: [], recibo: '', criadoEm: '2026-10-20', atualizadoEm: '2026-10-20' },
    { id: 2, petId: 2, chegada: '2026-10-30', partida: '2026-11-03', status: 'Em andamento', total: 40, notas: 'Tem medo de barulho.', anotacoes: 'Comendo bem.', imagens: ['img/placeholder.png'], recibo: '', criadoEm: '2026-10-15', atualizadoEm: '2026-10-31' },
    { id: 3, petId: 1, chegada: '2026-05-02', partida: '2026-05-06', status: 'Finalizada', total: 40, notas: '', anotacoes: 'Passeou todos os dias.', imagens: ['img/placeholder.png', 'img/placeholder.png', 'img/placeholder.png'], recibo: '', criadoEm: '2026-05-02', atualizadoEm: '2026-05-06' },
    { id: 4, petId: 3, chegada: '2026-09-14', partida: '2026-09-20', status: 'Finalizada', total: 60, notas: '', anotacoes: '', imagens: [], recibo: '', criadoEm: '2026-09-01', atualizadoEm: '2026-09-20' },
    { id: 5, petId: 5, chegada: '2026-11-20', partida: '2026-11-27', status: 'Reservada', total: 70, notas: 'Toma remédio de alergia.', anotacoes: '', imagens: [], recibo: '', criadoEm: '2026-10-28', atualizadoEm: '2026-10-28' },
    { id: 6, petId: 4, chegada: '2026-10-05', partida: '2026-10-08', status: 'Cancelada', total: 30, notas: '', anotacoes: '', imagens: [], recibo: '', criadoEm: '2026-09-22', atualizadoEm: '2026-10-01' },
    { id: 7, petId: 6, chegada: '2026-11-01', partida: '2026-11-05', status: 'Em andamento', total: 40, notas: '', anotacoes: '', imagens: [], recibo: '', criadoEm: '2026-10-25', atualizadoEm: '2026-11-01' }
];

const configuracoesIniciais = { diaria: 10, vagas: 3 };

// pega uma lista salva no localStorage (usuarios, pets ou reservas)
function listar(nome) {
    return JSON.parse(localStorage.getItem(nome)) || [];
}

// salva a lista inteira de volta no localStorage
// o localStorage tem limite (uns 5MB), se encher com muita foto da erro aqui
function salvar(nome, lista) {
    try {
        localStorage.setItem(nome, JSON.stringify(lista));
        return true;
    } catch (erro) {
        alert('Não deu pra salvar: o espaço do navegador acabou. Tente usar imagens menores.');
        return false;
    }
}

// procura um item pelo id dentro de uma lista
function buscarPorId(nome, id) {
    return listar(nome).find(function (item) {
        return item.id == id;
    });
}

// o proximo id e o maior id da lista + 1
function proximoId(nome) {
    let maior = 0;
    listar(nome).forEach(function (item) {
        if (item.id > maior) {
            maior = item.id;
        }
    });
    return maior + 1;
}

function pegarConfiguracoes() {
    return JSON.parse(localStorage.getItem('configuracoes')) || configuracoesIniciais;
}

// se ainda nao tiver nada salvo, salva os dados iniciais
if (localStorage.getItem('usuarios') === null) {
    salvar('usuarios', usuariosIniciais);
    salvar('pets', petsIniciais);
    salvar('reservas', reservasIniciais);
    salvar('configuracoes', configuracoesIniciais);
}

// para voltar aos dados iniciais e so rodar resetarDados() no console do navegador
function resetarDados() {
    localStorage.clear();
    sessionStorage.clear();
    location.reload();
}

// ---------- formatacao ----------

// '2026-11-10' vira '10/11/2026'
function formatarData(data) {
    if (!data) return '';
    const partes = data.split('-');
    return partes[2] + '/' + partes[1] + '/' + partes[0];
}

// 40 vira 'R$ 40,00'
function formatarMoeda(valor) {
    return 'R$ ' + Number(valor).toFixed(2).replace('.', ',');
}

// data de hoje no formato '2026-11-02'
function dataDeHoje() {
    return new Date().toISOString().slice(0, 10);
}

function nomeCompleto(usuario) {
    return usuario.nome + ' ' + usuario.sobrenome;
}

// classe do CSS de cada status (cor da etiqueta)
function classeStatus(status) {
    if (status === 'Reservada') return 'reservada';
    if (status === 'Em andamento') return 'andamento';
    if (status === 'Finalizada') return 'finalizada';
    if (status === 'Cancelada') return 'cancelada';
    if (status === 'Ativo') return 'ativo';
    if (status === 'Inativo') return 'inativo';
    return '';
}
