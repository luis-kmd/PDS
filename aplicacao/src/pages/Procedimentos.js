import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Check, FileText } from "lucide-react";
import axios from "axios";
import logo from "../img/logo.png";
import "../style/procedimentos.css"; 
import "../style/setores.css"; 

const API_URL = "http://localhost:3001";

export default function Procedimentos() {
  const navigate = useNavigate();

  const [procedimentos, setProcedimentos] = useState([]);
  const [setores, setSetores] = useState([]);
  const [busca, setBusca] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(false);
  const [procedimentoEditando, setProcedimentoEditando] = useState(null);

  const [descricao, setDescricao] = useState("");
  const [idSetor, setIdSetor] = useState("");
  const [valorUnitario, setValorUnitario] = useState("");

  const [erroValidacao, setErroValidacao] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);
  const [mensagemModal, setMensagemModal] = useState("");
  const [procedimentoParaExcluir, setProcedimentoParaExcluir] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      setCarregando(true);
      try {
        const [resProcs, resSetores] = await Promise.all([
          axios.get(`${API_URL}/procedimentos`),
          // BUSCA SETORES
          axios.get(`${API_URL}/setores`)
        ]);
        setProcedimentos(resProcs.data);
        setSetores(resSetores.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setErroValidacao("Erro ao carregar dados. Verifique o servidor.");
      } finally {
        setCarregando(false);
      }
    };
    carregarDados();
  }, []);

  const procedimentosFiltrados = procedimentos.filter((p) =>
    p.descricao?.toLowerCase().includes(busca.toLowerCase()) ||
    p.setor_nome?.toLowerCase().includes(busca.toLowerCase())
  );

  const handleGravar = async () => {
    if (!descricao || !valorUnitario || !idSetor) {
      setErroValidacao("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    setErroValidacao("");
    setCarregando(true);

    const novoProcedimento = {
      descricao,
      valor_unitario: parseFloat(valorUnitario),
      id_setor: parseInt(idSetor),
    };

    try {
      if (editando && procedimentoEditando) {
        await axios.put(`${API_URL}/procedimentos/${procedimentoEditando.id}`, novoProcedimento);
      } else {
        await axios.post(`${API_URL}/procedimentos`, novoProcedimento);
      }
      
      const response = await axios.get(`${API_URL}/procedimentos`); // Recarrega os dados
      setProcedimentos(response.data);
      setMensagemModal(editando ? "Alterações salvas com sucesso!" : "Cadastro efetuado com sucesso!");
      setMostrarModalSucesso(true);
      limparFormulario();
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Erro ao salvar procedimento:", error);
      setErroValidacao("Erro ao salvar procedimento. Verifique o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  const limparFormulario = () => {
    setDescricao("");
    setValorUnitario("");
    setIdSetor("");
    setProcedimentoEditando(null);
    setEditando(false);
    setErroValidacao("");
  };

  const handleEditar = (procedimento) => {
    setEditando(true);
    setMostrarFormulario(true);
    setProcedimentoEditando(procedimento);
    setDescricao(procedimento.descricao);
    setValorUnitario(procedimento.valor_unitario);
    setIdSetor(procedimento.id_setor);
  };

  const handleExcluir = (procedimento) => {
    setProcedimentoParaExcluir(procedimento);
    setMostrarModalConfirmacao(true);
  };

  const confirmarExclusao = async () => {
    if (procedimentoParaExcluir) {
      try {
        await axios.delete(`${API_URL}/procedimentos/${procedimentoParaExcluir.id}`);
        setProcedimentos(procedimentos.filter((p) => p.id !== procedimentoParaExcluir.id));
        setMensagemModal(`O procedimento "${procedimentoParaExcluir.descricao}" foi excluído.`);
        setMostrarModalSucesso(true);
      } catch (error) {
        console.error("Erro ao excluir procedimento:", error);
        setErroValidacao("Erro ao excluir procedimento.");
      } finally {
        setMostrarModalConfirmacao(false);
        setProcedimentoParaExcluir(null);
      }
    }
  };

  return (
    <div className="pagina__procedimento">
      <header className="funcionarios__header"> 
        <img src={logo} alt="Transvicon Logística" className="logo" />
        <button
          className="botao__voltar" 
          onClick={() => {
            if (mostrarFormulario) {
              setMostrarFormulario(false);
              limparFormulario();
            }
            else navigate("/gerenciamento");
          }}
        >
          ⬅ Voltar
        </button>
      </header>

      <div className="titulo__central__funcionarios"> 
        <h1>Procedimentos</h1>
        <FileText size={70} color="#000" />
      </div>

      {mostrarFormulario ? (
        <div className="formulario__container__funcionarios" style={{width: '600px'}}> 
          <div className="formulario__titulo__funcionarios"> 
            {editando ? "Editar Procedimento" : "Cadastro de Procedimento"}
          </div>

          <div className="formulario__campo__funcionarios" style={{gridColumn: '1 / -1'}}> 
            <label>Descrição*</label>
            <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Digite a descrição" />
          </div>

          <div className="formulario__campo__funcionarios"> 
            <label>Setor*</label>
            <select value={idSetor} onChange={(e) => setIdSetor(e.target.value)}>
              <option value="">Selecione o setor</option>
              {setores.map(s => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>
          </div>

          <div className="formulario__campo__funcionarios"> 
            <label>Valor Unitário (R$)*</label>
            <input type="number" step="0.01" value={valorUnitario} onChange={(e) => setValorUnitario(e.target.value)} placeholder="Ex: 50.00" />
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
              <input type="text" placeholder="Pesquisar por descrição ou setor" value={busca} onChange={(e) => setBusca(e.target.value)} />
            </div>
          </div>

          <div className="tabela__container"> 
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Descrição</th>
                  <th>Setor</th>
                  <th>Valor Unitário (R$)</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {procedimentosFiltrados.length > 0 ? (
                  procedimentosFiltrados.map((p, index) => (
                    <tr key={p.id}>
                      <td>{index + 1}</td>
                      <td>{p.descricao}</td>
                      <td>{p.setor_nome}</td>
                      <td>{parseFloat(p.valor_unitario).toFixed(2)}</td>
                      <td className="acao__botoes__modelo"> 
                        <button className="editar" onClick={() => handleEditar(p)}>Editar</button>
                        <button className="excluir" onClick={() => handleExcluir(p)}>Excluir</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5">Nenhum procedimento encontrado</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="cadastrar__container"> 
            <button className="cadastrar" onClick={() => { setMostrarFormulario(true); limparFormulario(); }}>
              Cadastrar Procedimento
            </button>
          </div>
        </>
      )}

      {mostrarModalConfirmacao && (
        <div className="modal__fundo">
          <div className="modal__confirmacao">
            <button className="modal__fechar" onClick={() => setMostrarModalConfirmacao(false)}><X size={24} /></button>
            <p>
              Excluir permanentemente o procedimento <strong>{procedimentoParaExcluir?.descricao}</strong>?
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