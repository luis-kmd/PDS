const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// CONEXAO COM O BANCO DE DADOS
const db = mysql.createConnection({
  host: 'localhost',          
  user: 'user',               
  password: 'senha', 
  database: 'transvicon'     
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});

// ROTA DE LOGIN
app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  // TABELA FUNCIONARIO PARA LOGIN
  const sql = "SELECT * FROM Funcionario WHERE login = ? AND senha = ?";

  db.query(sql, [usuario, senha], (err, data) => {
    if (err) {
      console.error("Erro na consulta de login:", err);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
    if (data.length > 0) {
      // USUARIO ENCONTRADO
      return res.json({ status: "Success" });
    } else {
      // SENHA INCORRETA
      return res.json({ status: "Error", message: "Credenciais inválidas" });
    }
  });
});


// SETORES - CRUD COMPLETO
/// 1. LER
app.get('/setores', (req, res) => {
  const sql = "SELECT id_setor as id, nome FROM Setor";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Erro ao buscar setores:", err);
      return res.status(500).json({ error: "Erro ao buscar dados dos setores." });
    }
    return res.json(data);
  });
});

// 2. CRIAR
app.post('/setores', (req, res) => {
  const { nome } = req.body;
  const sql = "INSERT INTO Setor (nome) VALUES (?)";
  db.query(sql, [nome], (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar setor:", err);
      return res.status(500).json({ error: "Erro ao cadastrar novo setor." });
    }
    // Retorna o novo setor com o ID que acabou de ser criado
    res.status(201).json({ id: result.insertId, nome });
  });
});

// 3. ATUALIZAR
app.put('/setores/:id', (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  const sql = "UPDATE Setor SET nome = ? WHERE id_setor = ?";
  db.query(sql, [nome, id], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar setor:", err);
      return res.status(500).json({ error: "Erro ao atualizar o setor." });
    }
    res.json({ message: "Setor atualizado com sucesso." });
  });
});

// 4. DELETAR
app.delete('/setores/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM Setor WHERE id_setor = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Erro ao excluir setor:", err);
      return res.status(500).json({ error: "Erro ao excluir o setor." });
    }
    res.json({ message: "Setor excluído com sucesso." });
  });
});
// ---------------------------------------------------------------

// INICIAR O SERVIDOR
const port = 3001; // PORTA DIFERENTE DO SERVIDOR SERVER.JS
app.listen(port, () => {
  console.log(`🚀 Servidor back-end rodando em http://localhost:${port}`);
});