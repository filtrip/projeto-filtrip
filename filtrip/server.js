const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Carrega o Supabase sem derrubar o site caso o .env esteja faltando
let supabase = null;
let erroSupabase = null;
try {
    supabase = require('./supabase');
} catch (erro) {
    erroSupabase = erro.message;
    console.warn('Aviso: Supabase não carregou ->', erroSupabase);
}

const tipos = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.mp4': 'video/mp4'
};

// Arquivos do back-end que NUNCA devem ser entregues ao navegador
const privados = new Set([
    'server.js',
    'supabase.js',
    'package.json',
    'package-lock.json'
]);

function responderJSON(res, status, objeto) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(objeto));
}

async function testarSupabase(req, res) {
    if (!supabase) {
        return responderJSON(res, 500, { conectado: false, erro: erroSupabase });
    }

    try {
        const { error } = await supabase.from('pais').select('id_pais').limit(1);

        if (error) {
            return responderJSON(res, 500, { conectado: false, erro: error.message });
        }

        responderJSON(res, 200, {
            conectado: true,
            mensagem: 'Conexão com o Supabase funcionando!'
        });
    } catch (erro) {
        responderJSON(res, 500, { conectado: false, erro: erro.message });
    }
}

const servidor = http.createServer((req, res) => {
    const url = req.url.split('?')[0];

    if (url === '/api/teste') {
        return testarSupabase(req, res);
    }

    // decodeURIComponent lança erro com URL malformada: sem try/catch o servidor cai
    let caminho;
    try {
        caminho = decodeURIComponent(url);
    } catch {
        res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Requisição inválida');
    }

    if (caminho === '/') {
        caminho = '/index.html';
    }

    const arquivo = path.join(__dirname, caminho);
    const relativo = path.relative(__dirname, arquivo);
    const partes = relativo.split(path.sep);

    // Bloqueia saída da pasta, arquivos ocultos (.env, .git), node_modules e arquivos do back-end
    const proibido =
        relativo.startsWith('..') ||
        path.isAbsolute(relativo) ||
        partes.some(p => p.startsWith('.') || p === 'node_modules') ||
        privados.has(relativo);

    if (proibido) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Acesso negado');
    }

    const extensao = path.extname(arquivo).toLowerCase();
    const tipo = tipos[extensao];

    // Extensão desconhecida: não entrega (evita o navegador baixar o arquivo)
    if (!tipo) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Arquivo não encontrado');
    }

    fs.readFile(arquivo, (erro, conteudo) => {
        if (erro) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end('Arquivo não encontrado');
        }

        res.writeHead(200, {
            'Content-Type': tipo,
            'X-Content-Type-Options': 'nosniff',
            'Cache-Control': 'no-cache'
        });
        res.end(conteudo);
    });
});

servidor.listen(PORT, '0.0.0.0', () => {
    console.log(`Filtrip rodando na porta ${PORT}`);
});

