// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Gerenciamento from "./pages/Gerenciamento";
import Setores from "./pages/Setores";
import Modelos from "./pages/Modelos";
import Funcionarios from "./pages/Funcionarios";
import Veiculos from "./pages/Veiculos";
import Motoristas from "./pages/Motoristas";     
import Procedimentos from "./pages/Procedimentos";
import Pecas from "./pages/Pecas";           
import Ordens from "./pages/Ordens";   
import NovaOrdem from "./pages/NovaOrdem"; 
import DetalheOrdem from "./pages/DetalheOrdem";
import "./style/global.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/gerenciamento" element={<Gerenciamento />} />
        <Route path="/setores" element={<Setores />} />
        <Route path="/modelos" element={<Modelos />} />
        <Route path="/funcionarios" element={<Funcionarios />} />
        <Route path="/veiculos" element={<Veiculos />} />
        <Route path="/motoristas" element={<Motoristas />} />         
        <Route path="/procedimentos" element={<Procedimentos />} />   
        <Route path="/pecas" element={<Pecas />} /> 
        <Route path="/ordens" element={<Ordens />} />
        <Route path="/nova-ordem" element={<NovaOrdem />} /> 
        <Route path="/ordem/:id" element={<DetalheOrdem />} />
      </Routes>
    </Router>
  );
}

export default App;