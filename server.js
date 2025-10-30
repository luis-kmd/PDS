const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// CONEXAO COM O BANCO DE DADOS
const db = mysql.createConnection({
  host: 'localhost',          
  user: 'kmd',               
  password: 'Eloisa-gabi1992', 
  database: 'transvicon'     
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});


//     ROTA DE LOGIN
app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;
  const sql = `
    SELECT 
      f.nome as nomeFuncionario, 
      s.nome as nomeSetor 
    FROM Funcionario f
    JOIN Setor s ON f.id_setor = s.id_setor
    WHERE f.login = ? AND f.senha = ? AND f.situacao = 'Ativo'
  `;
  
  db.query(sql, [usuario, senha], (err, data) => {
    if (err) return res.status(500).json({ error: "Erro no servidor." });
    
    if (data.length > 0) {
      // SE ENCONTRAR DADOS DO USUARIO RETORNA ELES
      const usuarioLogado = {
        nome: data[0].nomeFuncionario,
        setor: data[0].nomeSetor
      };
      return res.json({ status: "Success", usuario: usuarioLogado });
    } else {
      return res.json({ status: "Error", message: "Credenciais inválidas ou usuário inativo." });
    }
  });
});


// SETORES - CRUD COMPLETO

// LER
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

// CRIAR
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

// ATUALIZAR
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

// DELETAR
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

// MODELO CRUD COMPLETO

// LER 
app.get('/modelos', (req, res) => {
  const sql = "SELECT id_modelo as id, nome, marca FROM Modelo";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar modelos." });
    return res.json(data);
  });
});

// CRIAR 
app.post('/modelos', (req, res) => {
  const { nome, marca } = req.body;
  const sql = "INSERT INTO Modelo (nome, marca) VALUES (?, ?)";
  db.query(sql, [nome, marca], (err, result) => {
    if (err) return res.status(500).json({ error: "Erro ao cadastrar modelo." });
    res.status(201).json({ id: result.insertId, nome, marca });
  });
});

// ATUALIZAR 
app.put('/modelos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, marca } = req.body;
  const sql = "UPDATE Modelo SET nome = ?, marca = ? WHERE id_modelo = ?";
  db.query(sql, [nome, marca, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Erro ao atualizar modelo." });
    res.json({ message: "Modelo atualizado com sucesso." });
  });
});

// DELETAR 
app.delete('/modelos/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM Modelo WHERE id_modelo = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Erro ao excluir o modelo." });
    res.json({ message: "Modelo excluído com sucesso." });
  });
});

// -------------------------------------------------------------

// INICIAR O SERVIDOR
const port = 3001; 
app.listen(port, () => {
  console.log(`🚀 Servidor back-end rodando em http://localhost:${port}`);
});