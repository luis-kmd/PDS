// src/pages/Pecas.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Check, Package } from "lucide-react";
import axios from "axios";
import logo from "../img/logo.png";
import "../style/pecas.css"; 
import "../style/setores.css"; 

const API_URL = "http://localhost:3001";

export default function Pecas() {
  const navigate = useNavigate();

  const [pecas, setPecas] = useState([]);
  const [busca, setBusca] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(false);
  const [pecaEditando, setPecaEditando] = useState(null);

  // FORMULARIO
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [valor, setValor] = useState("");

  const [erroValidacao, setErroValidacao] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);
  const [mensagemModal, setMensagemModal] = useState("");
  const [pecaParaExcluir, setPecaParaExcluir] = useState(null);

  useEffect(() => {
    const carregarPecas = async () => {
      setCarregando(true);
      try {
        const response = await axios.get(`${API_URL}/pecas`);
        setPecas(response.data);
      } catch (error) {
        console.error("Erro ao carregar peças:", error);
        setErroValidacao("Erro ao carregar peças. Verifique o servidor.");
      } finally {
        setCarregando(false);
      }
    };
    carregarPecas();
  }, []);

  const pecasFiltradas = pecas.filter((p) =>
    p.descricao?.toLowerCase().includes(busca.toLowerCase())
  );

  const limparFormulario = () => {
    setDescricao("");
    setQuantidade("");
    setValor("");
    setPecaEditando(null);
    setEditando(false);
    setErroValidacao("");
  };

  const handleGravar = async () => {
    if (!descricao || quantidade === '' || valor === '') {
      setErroValidacao("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    setErroValidacao("");
    setCarregando(true);

    const novaPeca = {
      descricao,
      quantidade_estoque: parseInt(quantidade),
      valor_unitario: parseFloat(valor),
    };

    try {
      if (editando && pecaEditando) {
        await axios.put(`${API_URL}/pecas/${pecaEditando.id}`, novaPeca);
      } else {
        await axios.post(`${API_URL}/pecas`, novaPeca);
      }

      const response = await axios.get(`${API_URL}/pecas`);
      setPecas(response.data);
      setMensagemModal(editando ? "Alterações salvas com sucesso!" : "Peça cadastrada com sucesso!");
      setMostrarModalSucesso(true);
      limparFormulario();
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Erro ao salvar peça:", error);
      setErroValidacao("Erro ao salvar peça. Verifique o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  const handleEditar = (peca) => {
    setEditando(true);
    setMostrarFormulario(true);
    setPecaEditando(peca);
    setDescricao(peca.descricao);
    setQuantidade(peca.quantidade_estoque);
    setValor(peca.valor_unitario);
  };

  const handleExcluir = (peca) => {
    setPecaParaExcluir(peca);
    setMostrarModalConfirmacao(true);
  };

  const confirmarExclusao = async () => {
    if (pecaParaExcluir) {
      try {
        await axios.delete(`${API_URL}/pecas/${pecaParaExcluir.id}`);
        setPecas(pecas.filter((p) => p.id !== pecaParaExcluir.id));
        setMensagemModal(`A peça "${pecaParaExcluir.descricao}" foi excluída.`);
        setMostrarModalSucesso(true);
      } catch (error) {
        console.error("Erro ao excluir peça:", error);
        setErroValidacao("Erro ao excluir peça.");
      } finally {
        setMostrarModalConfirmacao(false);
        setPecaParaExcluir(null);
      }
    }
  };

  return (
    <div className="pagina__pecas">
      <header className="funcionarios__header">
        <img src={logo} alt="Transvicon Logística" className="logo" />
        <button
          className="botao__voltar"
          onClick={() => {
            if (mostrarFormulario) {
              setMostrarFormulario(false);
              limparFormulario();
            } else {
              navigate("/gerenciamento");
            }
          }}
        >
          ⬅ Voltar
        </button>
      </header>

      <div className="titulo__central__funcionarios">
        <h1>Peças e Materiais</h1>
        <Package size={70} color="#000" />
      </div>

      {mostrarFormulario ? (
        <div className="formulario__container__funcionarios" style={{width: '600px'}}>
          <div className="formulario__titulo__funcionarios">
            {editando ? "Editar Peça" : "Cadastro de Peça"}
          </div>

          <div className="formulario__campo__funcionarios" style={{gridColumn: '1 / -1'}}>
            <label>Descrição*</label>
            <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Filtro de Ar" />
          </div>
          <div className="formulario__campo__funcionarios">
            <label>Quantidade em Estoque*</label>
            <input type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} placeholder="Ex: 10" />
          </div>
          <div className="formulario__campo__funcionarios">
            <label>Valor Unitário (R$)*</label>
            <input type="number" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Ex: 150.00" />
          </div>
          
          {erroValidacao && <div className="erro__mensagem__setor" style={{gridColumn: '1 / -1'}}>{erroValidacao}</div>}

          <div className="formulario__acoes__funcionarios">
            <button className="gravar" onClick={handleGravar} disabled={carregando}>
              {carregando ? "Salvando..." : "Gravar"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="acoes">
            <div className="barra__pesquisa">
              <Search className="icone__pesquisa" size={28} color="black" />
              <input type="text" placeholder="Pesquisar por descrição..." value={busca} onChange={(e) => setBusca(e.target.value)} />
            </div>
          </div>
          <div className="tabela__container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Descrição</th>
                  <th>Estoque</th>
                  <th>Valor Unitário (R$)</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pecasFiltradas.length > 0 ? (
                  pecasFiltradas.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.descricao}</td>
                      <td>{p.quantidade_estoque}</td>
                      <td>{parseFloat(p.valor_unitario).toFixed(2)}</td>
                      <td className="acao__botoes__modelo">
                        <button className="editar" onClick={() => handleEditar(p)}>Editar</button>
                        <button className="excluir" onClick={() => handleExcluir(p)}>Excluir</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5">Nenhuma peça encontrada</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="cadastrar__container">
            <button className="cadastrar" onClick={() => { setMostrarFormulario(true); limparFormulario(); }}>
              Cadastrar Nova Peça
            </button>
          </div>
        </>
      )}

      {mostrarModalConfirmacao && (
        <div className="modal__fundo">
          <div className="modal__confirmacao">
            <button className="modal__fechar" onClick={() => setMostrarModalConfirmacao(false)}><X size={24} /></button>
            <p>
              Excluir permanentemente a peça <strong>{pecaParaExcluir?.descricao}</strong>?
            </p>
            <div className="modal__botoes">
              <button className="modal__botao--excluir" onClick={confirmarExclusao}>Excluir</button>
              <button className="modal__botao--cancelar" onClick={() => setMostrarModalConfirmacao(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {mostrarModalSucesso && (
        <div className="modal__fundo">
          <div className="modal__sucesso">
            <button className="modal__fechar" onClick={() => setMostrarModalSucesso(false)}><X size={22} /></button>
            <p>{mensagemModal}</p>
            <Check size={38} color="#00bf63" />
          </div>
        </div>
      )}
    </div>
  );
}