const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'sistema_ponto'
});

db.connect((err) => {
  if (err) {
    console.error('Erro de conexão com o banco:', err);
    return; 
  }

  console.log('🟢 Conectado ao Banco com sucesso!');

  const usuariosTable = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      senha VARCHAR(255) NOT NULL,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(usuariosTable, (err) => {
    if (err) console.error('Erro ao criar tabela de usuários:', err);
    else console.log('✅ Tabela "usuarios" pronta.');
  });

  const pontoTable = `
    CREATE TABLE IF NOT EXISTS registros_ponto (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT NOT NULL,
      tipo ENUM('entrada', 'saida') NOT NULL,
      horario DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
  `;
  db.query(pontoTable, (err) => {
    if (err) console.error('Erro ao criar tabela de ponto:', err);
    else console.log('✅ Tabela "registros_ponto" pronta.');
  });
});

app.use(cors());
app.use(bodyParser.json());

app.post('/api/usuarios', (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
  }

  const query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
  db.query(query, [nome, email, senha], (err) => {
    if (err) {
      console.error('Erro ao cadastrar usuário:', err);
      return res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
    res.status(201).json({ mensagem: 'Usuário criado com sucesso!' });
  });
});

app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;

  const query = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
  db.query(query, [email, senha], (err, results) => {
    if (err) {
      console.error('Erro ao fazer login:', err);
      return res.status(500).json({ error: 'Erro ao autenticar' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    res.status(200).json({ mensagem: 'Login bem-sucedido', usuario: results[0] });
  });
});

app.post('/api/ponto', (req, res) => {
  const { usuario_id, tipo } = req.body;

  if (!usuario_id || !tipo || !['entrada', 'saida'].includes(tipo)) {
    return res.status(400).json({ error: 'Dados inválidos para registro de ponto' });
  }

  const query = 'INSERT INTO registros_ponto (usuario_id, tipo) VALUES (?, ?)';
  db.query(query, [usuario_id, tipo], (err) => {
    if (err) {
      console.error('Erro ao registrar ponto:', err);
      return res.status(500).json({ error: 'Erro ao registrar ponto' });
    }

    res.status(201).json({ mensagem: 'Ponto registrado com sucesso!' });
  });
});

app.get('/api/ponto/:usuario_id', (req, res) => {
  const usuario_id = req.params.usuario_id;

  const query = 'SELECT * FROM registros_ponto WHERE usuario_id = ? ORDER BY horario DESC';
  db.query(query, [usuario_id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar registros:', err);
      return res.status(500).json({ error: 'Erro ao buscar pontos' });
    }

    res.status(200).json(results);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
