const btn = document.getElementById('formulario');
const cadastrados = document.getElementById('cadastrados');

popularTabelaAoCarregarPagina();
adicionarEventoAoBotaoDeExcluir();

formulario.addEventListener('submit', (evento) => { 
    evento.preventDefault();
    let dados = $('#formulario').serializeArray();
    let clienteDado = arrayToObject(dados);




    let clientes = JSON.parse(localStorage.getItem('dadosClientes')) || [];

    let emailJaExistente = clientes
        .map(cliente => (JSON.parse(cliente)).email)
        .includes(clienteDado.email);
    
    if(emailJaExistente) {
        alert('Esse e-mail ja foi cadastrado, porfavor tente novamente.');
        return;
    }

    adicionarCadastros(clienteDado);
    
    clientes.push(JSON.stringify(clienteDado));
    
    localStorage.setItem('dadosClientes', JSON.stringify(clientes));
    document.location.reload(true);
});

// o parametro "array" deve ser gerado a partir da função
// .serializeArray() do jQuery para funcionar corretamente
function arrayToObject(array) {
    let object = {};
    array.forEach(campo => {
        object[campo.name] = campo.value;
    });
    return object;
}

function adicionarCadastros(clienteDado){

    let tr = document.createElement('tr');
    tr.innerHTML = `
        <tr>
            <td>${clienteDado.nome}</td>
            <td>${clienteDado.sobrenome}</td>
            <td>${clienteDado.email}</td>
            <td>${clienteDado.endereco}</td>    
            <td>${clienteDado.cidade}</td>
            <td>${clienteDado.enviar}</td>
            <td>
                <button class="btn btn-outline-danger excluir" data-clientes="${clienteDado.email}">
                    Excluir    
                </button>
            </td>
        </tr>
    `;
    cadastrados.appendChild(tr);
}

function popularTabelaAoCarregarPagina(){
    let clientesBancoDeDados = JSON.parse(localStorage.getItem('dadosClientes')) || [];
    clientesBancoDeDados.forEach(clienteDado => {
        clienteDado = JSON.parse(clienteDado);
        adicionarCadastros(clienteDado);
    });
};

function adicionarEventoAoBotaoDeExcluir(){
    $('.excluir').toArray().forEach(botaoExcluir =>{
        botaoExcluir.removeEventListener('click', (evento) => excluirRegistro(evento))
    });
    
    $('.excluir').toArray().forEach(botaoExcluir =>{
        botaoExcluir.addEventListener('click', (evento) => excluirRegistro(evento))
    });

    function excluirRegistro(evento){
        let dadoParaExcluir = evento.target.dataset.clientes;
        if(confirm(`Deseja excluir o cadastro do endereço de e-mail ${dadoParaExcluir}?`)){
            let dadosDoCliente = JSON.parse(localStorage.getItem('dadosClientes')) || [];
    
            dadosDoCliente = dadosDoCliente.map(cliente => JSON.parse(cliente));
    
            console.log(dadosDoCliente);
        
            let indexDadosParaExcluir = dadosDoCliente.findIndex(cliente => cliente.email == dadoParaExcluir);
    
            dadosDoCliente.splice(indexDadosParaExcluir, 1);
    
            dadosDoCliente = dadosDoCliente.map(cliente => JSON.stringify(cliente));
            localStorage.setItem('dadosClientes', JSON.stringify(dadosDoCliente));
            document.location.reload(true);
        }   
    }   
}
