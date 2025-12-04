// src/pages/DetalheOrdem.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import logo from "../img/logo.png";
import { Wrench, Package } from "lucide-react";
import "../style/detalheordem.css";
import "../style/setores.css";

const API_URL = "http://localhost:3001";

export default function DetalheOrdem() {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID da OS pela URL

  // Listas de dados mestre (para os dropdowns)
  const [listaProcedimentos, setListaProcedimentos] = useState([]);
  const [listaFuncionarios, setListaFuncionarios] = useState([]);
  const [listaPecas, setListaPecas] = useState([]);

  // Dados desta OS
  const [osDetalhes, setOsDetalhes] = useState(null);
  const [osProcedimentos, setOsProcedimentos] = useState([]);
  const [osItens, setOsItens] = useState([]);
  
  // State para o status
  const [statusAtual, setStatusAtual] = useState("");

  // Formulários de "Adicionar"
  const [procForm, setProcForm] = useState({
    id_procedimento: "",
    id_funcionario: "",
    data_realizacao: new Date().toISOString().split('T')[0] // Data de hoje como padrão
  });
  const [itemForm, setItemForm] = useState({ id_material: "", quantidade: 1 });

  const [carregando, setCarregando] = useState(true);

  // Função para carregar todos os dados da página
  const carregarTudo = async () => {
    try {
      const [
        resDetalhes, resOsProcs, resOsItens,
        resProcs, resFuncs, resPecas
      ] = await Promise.all([
        axios.get(`${API_URL}/ordem/${id}`),
        axios.get(`${API_URL}/ordem/${id}/procedimentos`),
        axios.get(`${API_URL}/ordem/${id}/itens`),
        axios.get(`${API_URL}/procedimentos`),
        axios.get(`${API_URL}/funcionarios`), // Busca funcionários
        axios.get(`${API_URL}/pecas`)
      ]);

      setOsDetalhes(resDetalhes.data);
      setStatusAtual(resDetalhes.data.status); // Define o status atual
      setOsProcedimentos(resOsProcs.data);
      setOsItens(resOsItens.data);
      setListaProcedimentos(resProcs.data);
      setListaFuncionarios(resFuncs.data); // Define a lista de funcionários
      setListaPecas(resPecas.data);
    } catch (error) {
      console.error("Erro ao carregar dados da OS:", error);
      alert("Erro ao carregar dados.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarTudo();
  }, [id]);

  // --- Funções de ADICIONAR ---
  const handleAddProcedimento = async () => {
    const { id_procedimento, id_funcionario, data_realizacao } = procForm;
    if (!id_procedimento || !id_funcionario || !data_realizacao) {
      alert("Selecione procedimento, funcionário e a data.");
      return;
    }
    const procInfo = listaProcedimentos.find(p => p.id === parseInt(id_procedimento));
    try {
      await axios.post(`${API_URL}/ordem/${id}/procedimentos`, {
        id_procedimento: procInfo.id,
        id_funcionario: parseInt(id_funcionario),
        valor_unitario: procInfo.valor_unitario,
        data_realizacao: data_realizacao
      });
      const res = await axios.get(`${API_URL}/ordem/${id}/procedimentos`);
      setOsProcedimentos(res.data);
    } catch (error) { 
      if (error.response && error.response.status === 409) {
        alert(error.response.data.error); 
      } else {
        alert("Erro ao adicionar procedimento. Verifique o console.");
        console.error("Erro ao adicionar procedimento:", error);
      }
    }
  };

  const handleAddItem = async () => {
    const { id_material, quantidade } = itemForm;
    if (!id_material || quantidade <= 0) {
      alert("Selecione uma peça e a quantidade.");
      return;
    }
    const itemInfo = listaPecas.find(p => p.id === parseInt(id_material));
    try {
      await axios.post(`${API_URL}/ordem/${id}/itens`, {
        id_material: itemInfo.id,
        quantidade: parseInt(quantidade),
        valor_unitario: itemInfo.valor_unitario
      });
      const res = await axios.get(`${API_URL}/ordem/${id}/itens`);
      setOsItens(res.data);
    } catch (error) { console.error("Erro ao adicionar item:", error); }
  };

  // --- (NOVO) Função para MUDAR STATUS ---
  const handleSalvarStatus = async () => {
    try {
      const data_fechamento = (statusAtual === 'Finalizada') ? new Date() : null;
      await axios.put(`${API_URL}/ordem/${id}/status`, {
        status: statusAtual,
        data_fechamento: data_fechamento
      });
      alert("Status atualizado com sucesso!");
      // Atualiza os detalhes na tela
      setOsDetalhes(prev => ({ ...prev, status: statusAtual }));
    } catch (error) {
      console.error("Erro ao salvar status:", error);
      alert("Erro ao salvar status.");
    }
  };

  if (carregando) return <div className="pagina__detalheordem"><h1>Carregando...</h1></div>;
  if (!osDetalhes) return <div className="pagina__detalheordem"><h1>Ordem de Serviço não encontrada.</h1></div>;

  return (
    <div className="pagina__detalheordem">
      <header className="funcionarios__header">
        <img src={logo} alt="Transvicon Logística" className="logo" />
        <button className="botao__voltar" onClick={() => navigate("/ordens")}>
          ⬅ Voltar para Lista de OS
        </button>
      </header>

      <div className="detalhe__container">
        {/* --- 1. RESUMO DA OS --- */}
        <div className="detalhe__resumo">
          
          {/* (NOVO) Campo de Status Editável */}
          <div className="detalhe__item" style={{ gridColumn: '1 / 3' }}>
            <label>Status da OS</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select value={statusAtual} onChange={(e) => setStatusAtual(e.target.value)} style={{ padding: '10px', fontSize: '16px' }}>
                <option value="Aberta">Aberta</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Finalizada">Finalizada</option>
              </select>
              <button className="gravar" onClick={handleSalvarStatus} style={{ height: 'auto' }}>Salvar Status</button>
            </div>
          </div>

          <div className="detalhe__item"><label>Prioridade</label><span>{osDetalhes.prioridade}</span></div>
          <div className="detalhe__item"><label>Data Abertura</label><span>{osDetalhes.data_abertura}</span></div>
            
            {/* Este campo só aparece se a data_fechamento não for nula */}
            {osDetalhes.data_fechamento && (
              <div className="detalhe__item">
                <label>Data Finalização</label>
                <span>{osDetalhes.data_fechamento}</span>
              </div>
            )}
          <div className="detalhe__item"><label>Veículo (Placa)</label><span>{osDetalhes.placa}</span></div>
          <div className="detalhe__item"><label>Modelo</label><span>{osDetalhes.modelo_nome} ({osDetalhes.modelo_marca})</span></div>
          <div className="detalhe__item"><label>KM Atual</label><span>{osDetalhes.quilometragem_atual}</span></div>
          <div className="detalhe__item"><label>Motorista</label><span>{osDetalhes.nome_motorista}</span></div>
          <div className="detalhe__item" style={{ gridColumn: '2 / -1' }}><label>Problema Relatado</label><span>{osDetalhes.problema}</span></div>
        </div>

        {/* --- 2. SEÇÕES DE ADICIONAR --- */}
        <div className="detalhe__secoes">
          
          {/* MÃO DE OBRA (PROCEDIMENTOS) */}
          <div className="secao__container">
            <h2><Wrench size={24}/> Mão de Obra / Procedimentos</h2>
            <div className="secao__form" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {/* (NOVO) Campo de Data */}
              <div className="formulario__campo__funcionarios" style={{ gridColumn: '1 / -1' }}>
                <label>Data da Realização</label>
                <input type="date" value={procForm.data_realizacao} onChange={(e) => setProcForm({ ...procForm, data_realizacao: e.target.value })} />
              </div>

              <select value={procForm.id_procedimento} onChange={(e) => setProcForm({ ...procForm, id_procedimento: e.target.value })}>
                <option value="">Selecione um procedimento</option>
                {listaProcedimentos.map(p => <option key={p.id} value={p.id}>{p.descricao} (R$ {parseFloat(p.valor_unitario).toFixed(2)})</option>)}
              </select>
              
              <select value={procForm.id_funcionario} onChange={(e) => setProcForm({ ...procForm, id_funcionario: e.target.value })}>
                <option value="">Selecione um funcionário</option>
                {/* (NOVO) Verificação se a lista está vazia */}
                {listaFuncionarios.length === 0 ? (
                  <option disabled>Nenhum funcionário cadastrado</option>
                ) : (
                  listaFuncionarios.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)
                )}
              </select>

              <button className="cadastrar" onClick={handleAddProcedimento} style={{ gridColumn: '1 / -1' }}>+ Adicionar Procedimento</button>
            </div>
            <div className="secao__tabela">
              <table>
                <thead><tr><th>Procedimento</th><th>Funcionário</th><th>Valor</th></tr></thead>
                <tbody>
                  {osProcedimentos.map((p, i) => (
                    <tr key={i}>
                      <td>{p.descricao}</td><td>{p.nome_funcionario}</td><td>R$ {parseFloat(p.valor_unitario).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PEÇAS (ITENS) */}
          <div className="secao__container">
            <h2><Package size={24}/> Peças / Itens</h2>
            <div className="secao__form" style={{ gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
              <select value={itemForm.id_material} onChange={(e) => setItemForm({ ...itemForm, id_material: e.target.value })}>
                <option value="">Selecione uma peça</option>
                {listaPecas.length === 0 ? (
                  <option disabled>Nenhuma peça cadastrada</option>
                ) : (
                  listaPecas.map(p => <option key={p.id} value={p.id}>{p.descricao} (Estoque: {p.quantidade_estoque})</option>)
                )}
              </select>
              <input type="number" value={itemForm.quantidade} onChange={(e) => setItemForm({ ...itemForm, quantidade: e.target.value })} />
              <button className="cadastrar" onClick={handleAddItem} style={{ gridColumn: '1 / -1' }}>+ Adicionar Peça</button>
            </div>
            <div className="secao__tabela">
              <table>
                <thead><tr><th>Item</th><th>Qtd.</th><th>Valor (Unid)</th></tr></thead>
                <tbody>
                  {osItens.map((item, i) => (
                    <tr key={i}>
                      <td>{item.descricao}</td><td>{item.quantidade}</td><td>R$ {parseFloat(item.valor_unitario).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}