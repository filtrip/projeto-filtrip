const PRECO_NOITE = 710;

// AVISO

const aviso = document.getElementById("aviso");
let tempoAviso;

function avisar(texto) {
    aviso.textContent = texto;
    aviso.classList.add("visivel");
    clearTimeout(tempoAviso);
    tempoAviso = setTimeout(function() { aviso.classList.remove("visivel"); }, 2800);
}

document.addEventListener("click", function(event) {
    if (event.target.closest("[data-breve]")) {
        event.preventDefault();
        avisar("Em breve!");
    }
});

// MENU DO CABEÇALHO

const botaoMenu = document.getElementById("botaoMenu");
const menuLateral = document.getElementById("menuLateral");

function alternarMenu(abrir) {
    menuLateral.classList.toggle("aberto", abrir);
    botaoMenu.setAttribute("aria-expanded", menuLateral.classList.contains("aberto"));
}

botaoMenu.addEventListener("click", function(event) {
    event.stopPropagation();
    alternarMenu();
});

document.addEventListener("click", function(event) {
    if (!menuLateral.contains(event.target)) alternarMenu(false);
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") alternarMenu(false);
});

// DATAS E CONSULTA

const entrada = document.getElementById("entrada");
const saida = document.getElementById("saida");
const msgData = document.getElementById("msgData");

function dataLocal(valor) {
    return new Date(valor + "T00:00:00");
}

function textoData(data) {
    return data.toISOString().slice(0, 10);
}

function mostrarMensagem(texto, tipo) {
    msgData.querySelector("span").textContent = texto;
    msgData.className = "msg-data" + (tipo ? " " + tipo : "");
}

const hoje = new Date();
hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
entrada.min = textoData(hoje);
saida.min = textoData(hoje);

entrada.addEventListener("change", function() {
    if (!entrada.value) return;
    const minimo = dataLocal(entrada.value);
    minimo.setDate(minimo.getDate() + 1);
    saida.min = textoData(minimo);
    if (saida.value && dataLocal(saida.value) <= dataLocal(entrada.value)) saida.value = "";
});

document.getElementById("botaoConsultar").addEventListener("click", function() {
    if (!entrada.value || !saida.value) {
        mostrarMensagem("Escolha a entrada e a saída para consultar.", "erro");
        return;
    }

    const noites = Math.round((dataLocal(saida.value) - dataLocal(entrada.value)) / 86400000);

    if (noites < 1) {
        mostrarMensagem("A saída precisa ser depois da entrada.", "erro");
        return;
    }

    const total = (noites * PRECO_NOITE).toLocaleString("pt-BR");
    mostrarMensagem(noites + (noites === 1 ? " noite" : " noites") + " · referência de R$ " + total, "ok");

    try {
        sessionStorage.setItem("consultaFiltrip", JSON.stringify({
            hotel: "Royal Atlantic Beach", entrada: entrada.value, saida: saida.value,
            hospedes: document.getElementById("hospedes").value
        }));
    } catch (erro) { /* sem armazenamento */ }

    avisar("Consulta registrada. Isso não é uma reserva.");
});
