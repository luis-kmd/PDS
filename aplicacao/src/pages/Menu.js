import React from "react";
import "../style/menu.css";
import { Database, Wrench, BarChart3 } from "lucide-react";
import logo from "../img/logo.png";
import { useNavigate } from "react-router-dom";

export default function Menu() {
    const navigate = useNavigate();

    // PEGA DADOS DO LOCALSTORAGE (LOGIN)
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    // VERIFICA AS PERMISSÕES DE TELA
    const podeVerGerenciamento = usuarioLogado?.setor && 
      (usuarioLogado.setor.toLowerCase() === 'admin' || 
       usuarioLogado.setor.toLowerCase() === 'gerenciamento');

    // LOGOUT
    const handleLogout = () => {
      // REMOÇÃO DOS DADOS DO LOCALSTORAGE (LOGIN)
      localStorage.removeItem('usuarioLogado');
      // VOLTA PARA PÁGINA DE LOGIN
      navigate('/');
    };

  return (
    <div className="pagina__menu">
      
      <header className="menu__header">
        <img src={logo} alt="Transvicon Logística" className="menu__logo_img" style={{maxWidth: '800px'}}/>

        {/* INFORMAÇÃO DO USUÁRIO */}
        {usuarioLogado && (
          <div className="menu__usuario_info">
            <h2>
              Bem-vindo, {usuarioLogado.nome}!
            </h2>
            <button className="botao__logout" onClick={handleLogout}>
              SAIR
            </button>
          </div>
        )}
      </header>
      
      <div className="menu__opcoes">
        {podeVerGerenciamento && (
          <div className="menu__item" onClick={() => navigate("/gerenciamento")}>
            <Database size={60} color="#e60000" />
            <p>GERENCIAMENTO</p>
          </div>
        )}
          <div className="menu__item" onClick={() => navigate("/ordens")}> 
          <Wrench size={60} color="#e60000" />
          <p>ORDENS DE SERVIÇO</p>
        </div>
        {podeVerGerenciamento && (
          <div className="menu__item">
            <BarChart3 size={60} color="#e60000" />
            <p>RELATÓRIOS</p>
          </div>
        )}
      </div>
    </div>
  );
}