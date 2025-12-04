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
  password: '123', 
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


// CRUD COMPLETO MATERIAIS

// LER
app.get('/pecas', (req, res) => {
  const sql = "SELECT id_material as id, descricao, quantidade_estoque, valor_unitario FROM Material";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar peças." });
    return res.json(data);
  });
});

// CRIAR
app.post('/pecas', (req, res) => {
  const { descricao, quantidade_estoque, valor_unitario } = req.body;
  const sql = "INSERT INTO Material (descricao, quantidade_estoque, valor_unitario) VALUES (?, ?, ?)";
  db.query(sql, [descricao, quantidade_estoque, valor_unitario], (err, result) => {
    if (err) return res.status(500).json({ error: "Erro ao cadastrar peça." });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});

// ATUALIZAR
app.put('/pecas/:id', (req, res) => {
  const { id } = req.params;
  const { descricao, quantidade_estoque, valor_unitario } = req.body;
  const sql = "UPDATE Material SET descricao = ?, quantidade_estoque = ?, valor_unitario = ? WHERE id_material = ?";
  db.query(sql, [descricao, quantidade_estoque, valor_unitario, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Erro ao atualizar peça." });
    res.json({ message: "Peça atualizada." });
  });
});

// DELETAR
app.delete('/pecas/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM Material WHERE id_material = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Erro ao excluir peça." });
    res.json({ message: "Peça excluída." });
  });
});


// -------------------------------------------------------------


// CRUD COMPLETO PROCEDIMENTOS

// LER
app.get('/procedimentos', (req, res) => {
  const sql = `
    SELECT 
      p.id_procedimento as id, 
      p.descricao, 
      p.valor_unitario, 
      p.id_setor,
      s.nome as setor_nome
    FROM Procedimento p
    JOIN Setor s ON p.id_setor = s.id_setor
  `;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar procedimentos." });
    return res.json(data);
  });
});

// CRIAR
app.post('/procedimentos', (req, res) => {
  const { descricao, valor_unitario, id_setor } = req.body;
  const sql = "INSERT INTO Procedimento (descricao, valor_unitario, id_setor) VALUES (?, ?, ?)";
  db.query(sql, [descricao, valor_unitario, id_setor], (err, result) => {
    if (err) return res.status(500).json({ error: "Erro ao cadastrar procedimento." });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});

// ATUALIZAR
app.put('/procedimentos/:id', (req, res) => {
  const { id } = req.params;
  const { descricao, valor_unitario, id_setor } = req.body;
  const sql = "UPDATE Procedimento SET descricao = ?, valor_unitario = ?, id_setor = ? WHERE id_procedimento = ?";
  db.query(sql, [descricao, valor_unitario, id_setor, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Erro ao atualizar procedimento." });
    res.json({ message: "Procedimento atualizado." });
  });
});

// DELETAR
app.delete('/procedimentos/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM Procedimento WHERE id_procedimento = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Erro ao excluir procedimento." });
    res.json({ message: "Procedimento excluído." });
  });
});


// -------------------------------------------------------------


// CRUD COMPLETO MOTORISTAS

// LER
app.get('/motoristas', (req, res) => {
  const sql = "SELECT *, id_motorista as id FROM Motorista";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar motoristas." });
    // FORMATA DADA
    const formattedData = data.map(m => ({
      ...m,
      data_admissao: m.data_admissao ? new Date(m.data_admissao).toISOString().split('T')[0] : null,
      data_demissao: m.data_demissao ? new Date(m.data_demissao).toISOString().split('T')[0] : null
    }));
    return res.json(formattedData);
  });
});

// CRIAR
app.post('/motoristas', (req, res) => {
  const { nome, cpf, cnh, situacao, data_admissao, data_demissao } = req.body;

  // LIMPEZA: Garante que CPF e CNH tenham apenas números
  const cpfLimpo = cpf.replace(/\D/g, "");
  const cnhLimpa = cnh.replace(/\D/g, "");

  const sql = "INSERT INTO Motorista (nome, cpf, cnh, situacao, data_admissao, data_demissao) VALUES (?, ?, ?, ?, ?, ?)";
  
  // Usa as variáveis limpas
  const values = [nome, cpfLimpo, cnhLimpa, situacao, data_admissao, data_demissao || null];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Erro no INSERT Motorista:", err); // Log para ver o erro real no terminal
      return res.status(500).json({ error: "Erro ao cadastrar motorista." });
    }
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});

// ATUALIZAR
app.put('/motoristas/:id', (req, res) => {
  const { id } = req.params;
  const { nome, cpf, cnh, situacao, data_admissao, data_demissao } = req.body;

  // LIMPEZA: Garante que CPF e CNH tenham apenas números
  const cpfLimpo = cpf.replace(/\D/g, "");
  const cnhLimpa = cnh.replace(/\D/g, "");

  const sql = "UPDATE Motorista SET nome = ?, cpf = ?, cnh = ?, situacao = ?, data_admissao = ?, data_demissao = ? WHERE id_motorista = ?";
  
  // Usa as variáveis limpas
  const values = [nome, cpfLimpo, cnhLimpa, situacao, data_admissao, data_demissao || null, id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Erro no UPDATE Motorista:", err); // Log para ver o erro real
      return res.status(500).json({ error: "Erro ao atualizar motorista." });
    }
    res.json({ message: "Motorista atualizado." });
  });
});

// DELETAR
app.delete('/motoristas/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM Motorista WHERE id_motorista = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Erro ao excluir motorista." });
    res.json({ message: "Motorista excluído." });
  });
});

// -------------------------------------------------------------


// INICIAR O SERVIDOR
const port = 3001; 
app.listen(port, () => {
  console.log(`🚀 Servidor back-end rodando em http://localhost:${port}`);
});