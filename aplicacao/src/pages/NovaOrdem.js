// src/pages/NovaOrdem.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../img/logo.png";
import "../style/novaordem.css"; // Nosso novo CSS
import "../style/setores.css"; // Reutilizando botões e mensagens

const API_URL = "http://localhost:3001";

export default function NovaOrdem() {
  const navigate = useNavigate();

  // Listas para os dropdowns
  const [veiculos, setVeiculos] = useState([]);
  const [motoristas, setMotoristas] = useState([]);

  // Dados do formulário
  const [idVeiculo, setIdVeiculo] = useState("");
  const [idMotorista, setIdMotorista] = useState("");
  const [km, setKm] = useState("");
  const [tipo, setTipo] = useState("Corretiva");
  const [prioridade, setPrioridade] = useState("Média");
  const [problema, setProblema] = useState("");

  const [erroValidacao, setErroValidacao] = useState("");

  // Carrega os dados dos dropdowns
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [resVeiculos, resMotoristas] = await Promise.all([
          axios.get(`${API_URL}/veiculos-lista`),
          axios.get(`${API_URL}/motoristas-lista`)
        ]);
        setVeiculos(resVeiculos.data);
        setMotoristas(resMotoristas.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setErroValidacao("Erro ao carregar dados dos formulários.");
      }
    };
    carregarDados();
  }, []);

  const handleSalvar = async () => {
    if (!idVeiculo || !idMotorista || !km || !problema) {
      setErroValidacao("Preencha todos os campos obrigatórios (*)");
      return;
    }

    const dadosOS = {
      id_veiculo: idVeiculo,
      id_motorista: idMotorista,
      quilometragem_atual: km,
      tipo: tipo,
      prioridade: prioridade,
      problema: problema
    };

    try {
      await axios.post(`${API_URL}/ordens`, dadosOS);
      alert("Ordem de Serviço criada com sucesso!");
      navigate("/ordens"); // Volta para a lista de OS
    } catch (error) {
      console.error("Erro ao criar OS:", error);
      setErroValidacao("Erro ao salvar a OS. Verifique o servidor.");
    }
  };

  return (
    <div className="pagina__novaordem">
      <header className="funcionarios__header">
        <img src={logo} alt="Transvicon Logística" className="logo" />
        <button className="botao__voltar" onClick={() => navigate("/ordens")}>
          ⬅ Cancelar e Voltar
        </button>
      </header>

      <div className="container__novaordem">
        <div className="novaordem__titulo">
          Abrir Nova Ordem de Serviço
        </div>

        {/* Linha 1: Veículo e Motorista */}
        <div className="formulario__campo__funcionarios">
          <label>Veículo (Placa)*</label>
          <select value={idVeiculo} onChange={(e) => setIdVeiculo(e.target.value)}>
            <option value="">Selecione um veículo...</option>
            {veiculos.map(v => <option key={v.placa} value={v.placa}>{v.placa}</option>)}
          </select>
        </div>
        <div className="formulario__campo__funcionarios">
          <label>Motorista (Relatou)*</label>
          <select value={idMotorista} onChange={(e) => setIdMotorista(e.target.value)}>
            <option value="">Selecione um motorista...</option>
            {motoristas.map(m => <option key={m.id_motorista} value={m.id_motorista}>{m.nome}</option>)}
          </select>
        </div>

        {/* Linha 2: KM, Tipo, Prioridade */}
        <div className="formulario__campo__funcionarios">
          <label>Quilometragem Atual*</label>
          <input type="number" value={km} onChange={(e) => setKm(e.target.value)} />
        </div>
        <div className="formulario__campo__funcionarios">
          <label>Tipo de Manutenção*</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="Corretiva">Corretiva</option>
            <option value="Preventiva">Preventiva</option>
          </select>
        </div>
        <div className="formulario__campo__funcionarios">
          <label>Prioridade*</label>
          <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
          </select>
        </div>
        <div className="formulario__campo__funcionarios"></div> {/* Célula vazia para alinhar */}

        {/* Linha 3: Problema */}
        <div className="formulario__campo__funcionarios campo__problema">
          <label>Descrição do Problema (Relatado pelo Motorista)*</label>
          <textarea value={problema} onChange={(e) => setProblema(e.target.value)} />
        </div>

        {erroValidacao && <div className="erro__mensagem__setor" style={{gridColumn: '1 / -1'}}>{erroValidacao}</div>}

        {/* Ações */}
        <div className="novaordem__acoes">
          <button className="gravar" onClick={handleSalvar}>
            Salvar e Abrir OS
          </button>
        </div>
      </div>
    </div>
  );
}