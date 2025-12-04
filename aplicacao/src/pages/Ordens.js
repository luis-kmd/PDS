// src/pages/Ordens.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, Search } from "lucide-react";
import axios from "axios";
import logo from "../img/logo.png";
import "../style/setores.css"; // Reutilizando CSS

const API_URL = "http://localhost:3001";

export default function Ordens() {
  const navigate = useNavigate();
  const [ordens, setOrdens] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const carregarOrdens = async () => {
      setCarregando(true);
      try {
        const response = await axios.get(`${API_URL}/ordens`);
        setOrdens(response.data);
      } catch (error) {
        console.error("Erro ao carregar ordens:", error);
      } finally {
        setCarregando(false);
      }
    };
    carregarOrdens();
  }, []);

  const ordensFiltradas = ordens.filter(os =>
    os.placa.toLowerCase().includes(busca.toLowerCase()) ||
    os.nome_motorista.toLowerCase().includes(busca.toLowerCase()) ||
    os.problema.toLowerCase().includes(busca.toLowerCase()) ||
    os.status.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="pagina__setores">
      <header className="funcionarios__header">
        <img src={logo} alt="Transvicon Logística" className="logo" />
        <button className="botao__voltar" onClick={() => navigate("/menu")}>
          ⬅ Voltar ao Menu
        </button>
      </header>

      <div className="titulo__central__funcionarios">
        <h1>Ordens de Serviço</h1>
        <Wrench size={70} color="#000" />
      </div>

      <div className="acoes">
        <div className="barra__pesquisa">
          <Search className="icone__pesquisa" size={28} color="black" />
          <input type="text" placeholder="Pesquisar por placa, motorista, problema..."
            value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
      </div>

      <div className="tabela__container">
        <table>
          <thead>
            <tr>
              <th>ID (OS)</th>
              <th>Data Abertura</th>
              <th>Status</th>
              <th>Prioridade</th>
              <th>Veículo (Placa)</th>
              <th>Motorista</th>
              <th>Problema</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr><td colSpan="8">Carregando...</td></tr>
            ) : ordensFiltradas.length > 0 ? (
              ordensFiltradas.map((os) => (
                <tr key={os.id_os}>
                  <td>{os.id_os}</td>
                  <td>{os.data_abertura}</td>
                  <td>{os.status}</td>
                  <td>{os.prioridade}</td>
                  <td>{os.placa}</td>
                  <td>{os.nome_motorista}</td>
                  <td>{os.problema}</td>
                  <td className="acao__botoes__modelo">
                    <button className="editar" onClick={() => navigate(`/ordem/${os.id_os}`)}>
                    Gerenciar
                    </button>
                </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8">Nenhuma ordem de serviço encontrada</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="cadastrar__container">
        <button className="cadastrar" onClick={() => navigate("/nova-ordem")}>
          Abrir Nova Ordem de Serviço
        </button>
      </div>
    </div>
  );
}