// DADOS (depois podem vir do Supabase por uma rota /api)

const LOCACOES = [
    {
        id: "montauk", icone: "pin",
        nome: "Praia de Montauk, NY", curto: "Montauk, NY",
        regiao: "Long Island · Nova York · EUA",
        descricao: "O primeiro encontro romântico de Clementine e Joel tem como cenário a praia de Montauk. Troque a tela pela paisagem real de Long Island.",
        cena: "imagens/montauk-cena.jpg",
        capCena: "É aqui onde acontece o primeiro encontro romântico de Clementine e Joel.",
        hoje: "imagens/montauk-hoje.jpg", seloHoje: "Montauk hoje",
        capHoje: "A praia de Montauk, em Long Island: o cenário do filme fora da ficção.",
        bbox: "-72.05,41.00,-71.85,41.09", lat: 41.0359, lon: -71.9545,
        legMapa: "Montauk · Long Island, NY", area: "Long Island",
        hoteis: [
            { nome: "Royal Atlantic Beach", local: "Beira-mar · Montauk, NY", nota: "3.8", preco: 710, img: "imagens/hotel-royal-atlantic.jpg", link: "hospedagem.html" },
            { nome: "Surf Lodge Montauk", local: "Beira-mar · Montauk, NY", nota: "4.7", preco: 980, img: "imagens/hotel-surf-lodge.jpg" },
            { nome: "Montauk Harborside", local: "Perto do porto · Montauk, NY", nota: "4.3", preco: 540, img: "imagens/hotel-harborside.jpg" }
        ]
    },
    {
        id: "union", icone: "livro",
        nome: "Livraria de Union Square, NY", curto: "Union Square, NY",
        regiao: "Manhattan · Nova York · EUA",
        descricao: "A livraria de Union Square também faz parte das lembranças do casal. Uma outra perspectiva da história, agora no cenário urbano de Manhattan.",
        cena: "imagens/union-cena.jpg",
        capCena: "A livraria de Union Square, em Manhattan, vista na história do casal.",
        hoje: "imagens/union-hoje.jpg", seloHoje: "Union Square hoje",
        capHoje: "Union Square hoje: o cenário urbano do filme fora da ficção.",
        bbox: "-74.01,40.725,-73.97,40.745", lat: 40.7359, lon: -73.9911,
        legMapa: "Union Square · Manhattan, NY", area: "Nova York",
        hoteis: [
            { nome: "W New York", local: "Nova York, NY", nota: "4.2", preco: 960, img: "imagens/hotel-w-new-york.jpg" },
            { nome: "Hyatt Union Square", local: "Nova York, NY", nota: "4.1", preco: 1020, img: "imagens/hotel-hyatt-union-square.jpg" },
            { nome: "Boutique Hotel Flatiron", local: "Nova York, NY", nota: "3.9", preco: 570, img: "imagens/hotel-flatiron.jpg" }
        ]
    }
];

const ICONES = {
    pin: '<svg class="i" width="22" height="22" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    livro: '<svg class="i" width="22" height="22" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    ok: '<svg class="i" width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    vazio: '<svg class="i" width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>',
    info: '<svg class="i" width="14" height="14" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
};

let selecionada = LOCACOES[0];

// AVISO (mensagem rápida)

const aviso = document.getElementById("aviso");
let tempoAviso;

function avisar(texto) {
    aviso.textContent = texto;
    aviso.classList.add("visivel");
    clearTimeout(tempoAviso);
    tempoAviso = setTimeout(function() { aviso.classList.remove("visivel"); }, 2800);
}

document.addEventListener("click", function(event) {
    const link = event.target.closest("[data-breve]");
    if (link) {
        event.preventDefault();
        avisar("Em breve!");
    }
});

// LOCAÇÕES

function desenharCartoes() {
    document.getElementById("cartoes").innerHTML = LOCACOES.map(function(loc) {
        const marcada = loc.id === selecionada.id;
        return '<button type="button" class="cartao" role="radio" data-id="' + loc.id + '" aria-checked="' + marcada + '">' +
            '<div class="cartao-topo"><h3>' + ICONES[loc.icone] + loc.nome + '</h3>' +
            '<span class="sel" title="' + (marcada ? "Selecionada" : "Selecionar") + '">' + (marcada ? ICONES.ok : ICONES.vazio) + '</span></div>' +
            '<p class="regiao">' + loc.regiao + '</p><p>' + loc.descricao + '</p></button>';
    }).join("");
}

function mostrarCena() {
    const loc = selecionada;
    document.getElementById("tituloCena").textContent = "Viva a cena: " + loc.curto;
    document.getElementById("imgCena").src = loc.cena;
    document.getElementById("legCena").textContent = loc.capCena;
    document.getElementById("imgHoje").src = loc.hoje;
    document.getElementById("seloHoje").textContent = loc.seloHoje;
    document.getElementById("legHoje").textContent = loc.capHoje;
    document.getElementById("mapa").src = "https://www.openstreetmap.org/export/embed.html?bbox=" +
        encodeURIComponent(loc.bbox) + "&layer=mapnik&marker=" + loc.lat + "," + loc.lon;
    document.getElementById("legMapa").innerHTML = ICONES.pin.replace('width="22" height="22"', 'width="14" height="14"') + " " + loc.legMapa;
    document.getElementById("ctaLocal").textContent = loc.nome;
}

document.getElementById("cartoes").addEventListener("click", function(event) {
    const cartao = event.target.closest(".cartao");
    if (!cartao) return;
    selecionada = LOCACOES.find(function(loc) { return loc.id === cartao.dataset.id; });
    desenharCartoes();
    mostrarCena();
});

// HOSPEDAGENS

function desenharHoteis() {
    document.getElementById("hoteis").innerHTML = LOCACOES.map(function(loc, i) {
        const cards = loc.hoteis.map(function(h) {
            return '<article class="hotel" tabindex="0" data-link="' + (h.link || "") + '"><div class="midia" data-rotulo="Foto: ' + h.nome + '">' +
                '<img src="' + h.img + '" alt="' + h.nome + '" loading="lazy" onerror="this.style.display=\'none\'"></div>' +
                '<div class="hotel-corpo"><div class="hotel-topo"><h4>' + h.nome + '</h4><span class="nota">★ ' + h.nota + '</span></div>' +
                '<p class="local">' + h.local + '</p>' +
                '<div class="ref">Referência por noite<p class="preco">R$ ' + h.preco + ' <small>/ noite</small></p></div></div></article>';
        }).join("");

        const nota = i === 0
            ? '<p class="aviso-preco">' + ICONES.info + ' Preços de referência, não são ofertas garantidas. Consulte valores e disponibilidade para as datas da sua viagem.</p>'
            : "";

        return '<div class="grupo"><div class="grupo-topo"><h3>' + ICONES.pin.replace("22", "20") + loc.nome + '</h3>' +
            '<span class="sub">' + loc.area + ' · ' + loc.hoteis.length + ' hospedagens</span></div>' +
            '<div class="grade-hot">' + cards + '</div>' + nota + '</div>';
    }).join("");
}

// BUSCA DE HOSPEDAGENS

document.getElementById("campoPesquisa").addEventListener("input", function(event) {
    const termo = event.target.value.toLowerCase().trim();
    let total = 0;

    document.querySelectorAll(".grupo").forEach(function(grupo) {
        let visiveis = 0;
        grupo.querySelectorAll(".hotel").forEach(function(hotel) {
            const achou = hotel.textContent.toLowerCase().includes(termo);
            hotel.hidden = !achou;
            if (achou) visiveis++;
        });
        grupo.hidden = visiveis === 0;
        total += visiveis;
    });

    document.getElementById("semResultado").hidden = total > 0;
});

// ABRIR DETALHE DA HOSPEDAGEM

function abrirHotel(card) {
    if (card.dataset.link) {
        window.location.href = card.dataset.link;
    } else {
        avisar("Em breve!");
    }
}

document.getElementById("hoteis").addEventListener("click", function(event) {
    const card = event.target.closest(".hotel");
    if (card) abrirHotel(card);
});

document.getElementById("hoteis").addEventListener("keydown", function(event) {
    const card = event.target.closest(".hotel");
    if (card && event.key === "Enter") abrirHotel(card);
});

// MINHA LISTA E PLANEJAR

const botaoLista = document.getElementById("botaoLista");

botaoLista.addEventListener("click", function() {
    const naLista = botaoLista.textContent.trim().startsWith("✓");
    botaoLista.textContent = naLista ? "+ Minha lista" : "✓ Na minha lista";
});

document.getElementById("botaoPlanejar").addEventListener("click", function() {
    try { sessionStorage.setItem("locacaoFiltrip", selecionada.id); } catch (erro) { /* sem armazenamento */ }
    avisar("Locação escolhida: " + selecionada.nome + ". O planejamento é a próxima etapa!");
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

// INÍCIO

desenharCartoes();
mostrarCena();
desenharHoteis();
