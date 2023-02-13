const lista = document.querySelector(".lista");
const form = document.getElementById("novoItem");
const itens = JSON.parse(localStorage.getItem("itens")) || [];

itens.forEach((item) => {
  adicionaLinha(item.id,item.nome, item.quantidade);
});

function verificaExistencia(nome) {
  let retorno = false;
  itens.forEach((item) => {
    if (Object.values(item).indexOf(nome) > -1) {
      retorno = item.id;
    }
  });
  return retorno;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const campos = [...form.elements];
  let isValidado = validaCampos(campos);

  if (isValidado) {
    let nome;
    let quantidade;
    campos.forEach((campo) => {
      switch (campo.id) {
        case "nome":
          nome = campo.value;
        case "quantidade":
          quantidade = campo.value;
        default:
          return false;
      }
    });
    const itemAtual = {
      nome: nome,
      quantidade: quantidade,
    };
    let existe = verificaExistencia(nome);
    if (existe !== false) {
      itemAtual.id = existe;

      atualizaLinha(itemAtual);
      
      itens[itens.findIndex(elemento => elemento.id === existe)] = itemAtual;

    } else {
      itemAtual.id = itens[itens.length-1] ? itens[itens.length-1].id + 1 : 1;
      adicionaLinha(itemAtual.id, nome, quantidade);
      
      itens.push(itemAtual);

    }
    localStorage.setItem("itens", JSON.stringify(itens));
    form.reset();
  }
});
function removerLinha(linha){
  linha.remove();
  
  itens.splice(itens[itens.findIndex(elemento => elemento.id === linha.dataset.id)], 1);
  localStorage.setItem("itens", JSON.stringify(itens));
}
function atualizaLinha(item){
 //console.log(id);
 let linha = document.querySelector(`[data-id="${item.id}"]`);
 linha.children[0].innerHTML = item.quantidade;
 itens[item.id-1] = item;
 //console.log(linha);
}
function adicionaLinha(id,nome, quantidade) {
  let novoItem = `<li class="item" data-id="${id}"><strong>${quantidade}</strong>${nome} <button id="deletar">X</button></li>`;
  lista.innerHTML += novoItem;
  let botaoDelete = lista.querySelectorAll('#deletar');
  botaoDelete.forEach((botao)=>{
    botao.addEventListener('click', function(e){
      let linha = e.target.parentNode;
      removerLinha(linha);
    })
})
}
function validaCampos(campos) {
  const validacao = ["nome", "quantidade"];
  let retorno = true;
  campos.forEach((campo) => {
    if (validacao.indexOf(campo.id) > -1 && campo.value == "") {
      alert("O campo " + campo.name + " necessita ser preenchido.");
      retorno = false;
    }
  });
  return retorno;
}
