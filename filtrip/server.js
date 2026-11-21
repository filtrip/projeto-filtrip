
const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const supabase = require('./supabase');

const tipos = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
};

async function testarSupabase(req, res) {
    const { error } = await supabase
        .from('pais')
        .select('id_pais')
        .limit(1);

    if (error) {
        res.writeHead(500, {
            'Content-Type': 'application/json; charset=utf-8'
        });

        return res.end(JSON.stringify({
            conectado: false,
            erro: error.message
        }));
    }

    res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8'
    });

    res.end(JSON.stringify({
        conectado: true,
        mensagem: 'Conexão com o Supabase funcionando!'
    }));
}

const servidor = http.createServer((req, res) => {
        if (req.url === '/api/teste') {
        testarSupabase(req, res);
        return;
    }
    let caminho = decodeURIComponent(req.url.split('?')[0]);

    if (caminho === '/') {
        caminho = '/index.html';
    }

    const arquivo = path.join(__dirname, caminho);

    if (!arquivo.startsWith(__dirname + path.sep)) {
        res.writeHead(403);
        return res.end('Acesso negado');
    }

    fs.readFile(arquivo, (erro, conteudo) => {
        if (erro) {
            res.writeHead(404, {
                'Content-Type': 'text/plain; charset=utf-8'
            });

            return res.end('Arquivo não encontrado');
        }

        const extensao = path.extname(arquivo);
        const tipo = tipos[extensao] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': tipo
        });

        res.end(conteudo);
    });
});

servidor.listen(PORT, '0.0.0.0', () => {
    console.log(`Filtrip rodando na porta ${PORT}`);
});
