
// PESQUISA DE FILMES

const campoPesquisa = document.getElementById("campoPesquisa");
const botaoPesquisa = document.getElementById("botaoPesquisa");

botaoPesquisa.addEventListener("click", pesquisarFilmes);

campoPesquisa.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        pesquisarFilmes();
    }
});

function pesquisarFilmes() {

    const pesquisa = campoPesquisa.value.toLowerCase().trim();

    const filmes = document.querySelectorAll(".card-filme");

    filmes.forEach(function(filme) {

        const titulo = filme.querySelector("h3").textContent.toLowerCase();

        if (titulo.includes(pesquisa)) {
            filme.style.display = "block";
        } else {
            filme.style.display = "none";
        }

    });

}


// FILTROS

const botoesFiltro = document.querySelectorAll(".filtro");

botoesFiltro.forEach(function(botao) {

    botao.addEventListener("click", function() {

        botoesFiltro.forEach(function(item) {
            item.classList.remove("ativo");
        });

        botao.classList.add("ativo");

        const filtro = botao.dataset.filtro;

        const filmes = document.querySelectorAll(".card-filme");

        filmes.forEach(function(filme) {

            filme.style.display = "block";

        });

        campoPesquisa.value = "";

        if (filtro === "todos") {
            return;
        }

        alert("O filtro de " + filtro + " será implementado na próxima etapa.");

    });

});


// FORMULÁRIO DE CONTATO

const formulario = document.getElementById("formContato");

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value;

    document.getElementById("mensagemFormulario").textContent =
        "Obrigada pelo contato, " + nome + "! Sua mensagem foi recebida.";

    formulario.reset();

});
