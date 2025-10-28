import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Search, X, Check } from "lucide-react";
import axios from "axios";
import logo from "../img/logo.png";
import "../style/motoristas.css";

export default function Motoristas() {
  const navigate = useNavigate();

  const API_URL = "http://localhost:3001/motoristas";

  const [motoristas, setMotoristas] = useState([]);
  const [busca, setBusca] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(false);
  const [motoristaEditando, setMotoristaEditando] = useState(null);

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [cnh, setCnh] = useState("");
  const [situacao, setSituacao] = useState("");
  const [dataAdmissao, setDataAdmissao] = useState("");
  const [dataDemissao, setDataDemissao] = useState("");

  const [erroValidacao, setErroValidacao] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);
  const [mensagemModal, setMensagemModal] = useState("");
  const [motoristaParaExcluir, setMotoristaParaExcluir] = useState(null);

  const mascaraCPF = (valor) => {
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const mascaraCNH = (valor) => valor.replace(/\D/g, "").substring(0, 11);

  // CARREGA OS MOTORISTAS DO BACKEND
  useEffect(() => {
    const carregarMotoristas = async () => {
      setCarregando(true);
      try {
        const response = await axios.get(API_URL);
        setMotoristas(response.data);
      } catch (error) {
        console.error("Erro ao carregar motoristas:", error);
        setErroValidacao("Erro ao carregar motoristas. Verifique o servidor.");
      } finally {
        setCarregando(false);
      }
    };
    carregarMotoristas();
  }, []);

  const motoristasFiltrados = motoristas.filter((m) =>
  m.nome?.toLowerCase().includes(busca.toLowerCase()) ||
  m.cpf?.includes(busca) ||
  m.cnh?.includes(busca) ||
  m.situacao?.toLowerCase().includes(busca.toLowerCase())
);


  // CADASTRAR OU EDITAR
  const handleGravar = async () => {
    if (!nome || !cpf || !cnh || !situacao || !dataAdmissao) {
      setErroValidacao("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setErroValidacao("");
    setCarregando(true);

    const novoMotorista = {
      nome,
      cpf: cpf.replace(/\D/g, ""), // FORMATA O CPF
      cnh, 
      situacao,
      data_admissao: dataAdmissao,
      data_demissao: dataDemissao || null, // GARANTE QUE ACEITE NULL
    };

    try {
      if (editando && motoristaEditando) {
        await axios.put(`${API_URL}/${motoristaEditando.id_motorista}`, novoMotorista);

        // ATUALIZA A LISTA
        const atualizados = motoristas.map((m) =>
          m.id_motorista === motoristaEditando.id_motorista 
            ? { ...m, ...novoMotorista, cpf: cpf } 
            : m
        );
        setMotoristas(atualizados);
        setMensagemModal("Alterações salvas com sucesso!");

      } else {
        const response = await axios.post(API_URL, novoMotorista);
        setMotoristas([...motoristas, { ...response.data, cpf: cpf, id_motorista: response.data.id }]);
        setMensagemModal("Cadastro efetuado com sucesso!");
      }

      setMostrarModalSucesso(true);
      limparFormulario();
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Erro ao salvar motorista:", error);
      setErroValidacao("Erro ao salvar motorista. Verifique o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  const limparFormulario = () => {
    setNome("");
    setCpf("");
    setCnh("");
    setSituacao("");
    setDataAdmissao("");
    setDataDemissao("");
    setMotoristaEditando(null);
    setEditando(false);
    setErroValidacao("");
  };

  const handleEditar = (motorista) => {
    setEditando(true);
    setMostrarFormulario(true);
    setMotoristaEditando(motorista);
    setNome(motorista.nome);
    setCpf(mascaraCPF(motorista.cpf)); 
    setCnh(motorista.cnh);
    setSituacao(motorista.situacao);
    setDataAdmissao(motorista.data_admissao || "");
    setDataDemissao(motorista.data_demissao || "");
  };

  const handleExcluir = (motorista) => {
    setMotoristaParaExcluir(motorista);
    setMostrarModalConfirmacao(true);
  };

  const confirmarExclusao = async () => {
    if (motoristaParaExcluir) {
      try {
        await axios.delete(`${API_URL}/${motoristaParaExcluir.id_motorista}`);
        setMotoristas(motoristas.filter((m) => m.id_motorista !== motoristaParaExcluir.id_motorista));
        setMensagemModal(`O motorista ${motoristaParaExcluir.nome} foi excluído com sucesso.`);
        setMostrarModalSucesso(true);
      } catch (error) {
        console.error("Erro ao excluir motorista:", error);
        setErroValidacao("Erro ao excluir motorista. Verifique o servidor.");
      } finally {
        setMostrarModalConfirmacao(false);
        setMotoristaParaExcluir(null);
      }
    }
  };

  return (
    <div className="pagina__motorista">
      {/* CABEÇALHO */}
      <header className="motorista__header">
        <img src={logo} alt="Transvicon Logística" className="logo" />
        <button
          className="botao__voltar__motorista"
          onClick={() => {
            if (mostrarFormulario) setMostrarFormulario(false);
            else navigate("/gerenciamento");
          }}
        >
          ⬅ Voltar
        </button>
      </header>

      <div className="titulo__central__motorista">
        <h1>Motoristas</h1>
        <User size={70} color="#000" />
      </div>

      {/* FORMULARIO */}
      {mostrarFormulario ? (
        <div className="formulario__container__motorista">
          <div className="formulario__titulo__motorista">
            {editando ? "Editar Motorista" : "Cadastro de Motorista"}
          </div>

          <div className="formulario__campo__motorista">
            <div className="campo__input__motorista">
              <label>Nome*</label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite o nome" />
            </div>

            <div className="campo__input__motorista">
              <label>CPF*</label>
              <input type="text" value={cpf} onChange={(e) => setCpf(mascaraCPF(e.target.value))} maxLength={14} placeholder="Digite o CPF" />
            </div>

            <div className="campo__input__motorista">
              <label>CNH*</label>
              <input type="text" value={cnh} onChange={(e) => setCnh(mascaraCNH(e.target.value))} maxLength={11} placeholder="Digite a CNH" />
            </div>

            <div className="campo__input__motorista">
              <label>Situação*</label>
              <select value={situacao} onChange={(e) => setSituacao(e.target.value)}>
                <option value="">Selecione</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>

            <div className="campo__input__motorista">
              <label>Data de Admissão*</label>
              <input type="date" value={dataAdmissao} onChange={(e) => setDataAdmissao(e.target.value)} />
            </div>

            <div className="campo__input__motorista">
              <label>Data de Demissão</label>
              <input type="date" value={dataDemissao} onChange={(e) => setDataDemissao(e.target.value)} />
            </div>
          </div>

          {erroValidacao && <div className="erro__mensagem__motorista">{erroValidacao}</div>}

          <div className="formulario__acoes__motorista">
            <button className="gravar__motorista" onClick={handleGravar} disabled={carregando}>
              {carregando ? "Salvando..." : "Gravar"}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* PESQUISA */}
          <div className="acoes__motorista">
            <div className="barra__pesquisa__motorista">
              <Search className="icone__pesquisa__motorista" size={28} color="black" />
              <input
                type="text"
                placeholder="Pesquisar motorista"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>

          <div className="tabela__container__motorista">
            <table className="tabela__motorista">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>CNH</th>
                  <th>Situação</th>
                  <th>Data Admissão</th>
                  <th>Data Demissão</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {motoristasFiltrados.length > 0 ? (
                  motoristasFiltrados.map((motorista) => (
                    <tr key={motorista.id_motorista}>
                      <td>{motorista.id_motorista}</td>
                      <td>{motorista.nome}</td>
                      <td>{motorista.cpf}</td>
                      <td>{motorista.cnh}</td>
                      <td>{motorista.situacao}</td>
                      <td>{motorista.data_admissao || "-"}</td>
                      <td>{motorista.data_demissao || "-"}</td>
                      <td className="acao__botoes__motorista">
                        <button className="editar__motorista" onClick={() => handleEditar(motorista)}>Editar</button>
                        <button className="excluir__motorista" onClick={() => handleExcluir(motorista)}>Excluir</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "15px" }}>
                      Nenhum motorista encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* BOTAO DE CADASTRO */}
          <div className="cadastrar__container__motorista">
            <button
              className="cadastrar__motorista"
              onClick={() => {
                setMostrarFormulario(true);
                setEditando(false);
                limparFormulario();
              }}
            >
              Cadastrar Motorista
            </button>
          </div>
        </>
      )}

      {mostrarModalConfirmacao && (
        <div className="modal__fundo__motorista">
          <div className="modal__confirmacao__motorista">
            <button className="modal__fechar__motorista" onClick={() => setMostrarModalConfirmacao(false)}>
              <X size={26} />
            </button>
            <p>
              Você está prestes a excluir permanentemente o motorista <strong>{motoristaParaExcluir?.nome}</strong>.
              <br /> Esta ação é irreversível.
            </p>
            <div className="modal__botoes__motorista">
              <button className="modal__botao__excluir__motorista" onClick={confirmarExclusao}>
                Excluir Permanentemente
              </button>
              <button className="modal__botao__cancelar__motorista" onClick={() => setMostrarModalConfirmacao(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarModalSucesso && (
        <div className="modal__fundo__motorista">
          <div className="modal__sucesso__motorista">
            <button className="modal__fechar__motorista" onClick={() => setMostrarModalSucesso(false)}>
              <X size={26} />
            </button>
            <p>{mensagemModal}</p>
            <Check size={38} color="#00bf63" />
          </div>
        </div>
      )}
    </div>
  );
}
