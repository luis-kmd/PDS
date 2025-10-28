// src/pages/Gerenciamento.js
import React from "react";
import "../style/gerenciamento.css";
import logo from "../img/logo.png";
import { Database, Truck, User, FileText, Cog, Package, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Gerenciamento() {
  const navigate = useNavigate();

  return (
    <div className="pagina__gerenciamento">
      <div className="gerenciamento__conteudo">
        {/* LADO ESQUERDO */}
        <div className="gerenciamento__esquerda">
          <img src={logo} alt="Transvicon Logística" />
          <div className="gerenciamento__titulo">
            <h1>Gerenciamento</h1>
            <Database size={120} color="#000" />
          </div>
          <div className="botao__voltar__container">
            <button className="botao__voltar" onClick={() => navigate("/menu")}>
              ⬅ Voltar
            </button>
          </div>
        </div>

        {/* MENUS LADO DIREITO*/}
        <div className="gerenciamento__direita">
          <div className="gerenciamento__item" onClick={() => navigate("/veiculos")}>
            <Truck size={28} color="#000" />
            <span>VEÍCULOS</span>
          </div>
          <div className="gerenciamento__item" onClick={() => navigate('/funcionarios')}>
            <User size={24} color="#000" />
            <span>FUNCIONÁRIOS</span>
          </div>
          <div className="gerenciamento__item" onClick={() => navigate('/motoristas')}>
            <User size={24} color="#000" />
            <span>MOTORISTAS</span>
          </div>
          <div className="gerenciamento__item" onClick={() => navigate('/procedimentos')}>
            <FileText size={28} color="#000" />
            <span>PROCEDIMENTOS</span>
          </div>
          <div className="gerenciamento__item" onClick={() => navigate("/setores")}>
            <Cog size={28} color="#000" />
            <span>SETORES</span>
          </div>
          <div className="gerenciamento__item" onClick={() => navigate("/pecas")}>
            <Package size={28} color="#000" />
            <span>PEÇAS</span>
          </div>
          <div className="gerenciamento__item" onClick={() => navigate("/modelos")}>
            <Settings size={28} color="#000" />
            <span>MODELOS</span>
          </div>
        </div>
      </div>
    </div>
  );
}