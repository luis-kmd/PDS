import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Search, X, Check } from "lucide-react";
import axios from "axios";
import logo from "../img/logo.png";
import "../style/veiculos.css"; 
import "../style/setores.css"; 

const API_URL = "http://localhost:3001";

export default function Veiculos() {
  const navigate = useNavigate();

  const [veiculos, setVeiculos] = useState([]);
  const [modelos, setModelos] = useState([]); 
  const [busca, setBusca] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(false);

  // FORMULARIO DADOS
  const [formData, setFormData] = useState({
    placa: "",
    id_modelo: "",
    tipo: "",
    ano_fabricacao: "",
    quilometragem: "",
    cor: "",
    chassi: "",
    situacao: "Ativo",
  });

  const [erroValidacao, setErroValidacao] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);
  const [mensagemModal, setMensagemModal] = useState("");
  const [veiculoParaExcluir, setVeiculoParaExcluir] = useState(null);


  useEffect(() => {
    const carregarDados = async () => {
      setCarregando(true);
      try {
        const [resVeiculos, resModelos] = await Promise.all([
          axios.get(`${API_URL}/veiculos`),
          axios.get(`${API_URL}/modelos`)
        ]);
        setVeiculos(resVeiculos.data);
        setModelos(resModelos.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setCarregando(false);
      }
    };
    carregarDados();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const limparFormulario = () => {
    setFormData({
      placa: "", id_modelo: "", tipo: "", ano_fabricacao: "", quilometragem: "", cor: "", chassi: "", situacao: "Ativo",
    });
    setEditando(false);
    setErroValidacao("");
  };

  const handleGravar = async () => {
    if (!formData.placa || !formData.id_modelo || !formData.tipo || !formData.ano_fabricacao || !formData.quilometragem || !formData.chassi || !formData.situacao) {
      setErroValidacao("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      if (editando) {
        await axios.put(`${API_URL}/veiculos/${formData.placa}`, formData);
        setMensagemModal("Veículo atualizado com sucesso!");
      } else {
        await axios.post(`${API_URL}/veiculos`, formData);
        setMensagemModal("Veículo cadastrado com sucesso!");
      }
      const response = await axios.get(`${API_URL}/veiculos`);
      setVeiculos(response.data);
      setMostrarModalSucesso(true);
      limparFormulario();
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Erro ao salvar veículo:", error);
      setErroValidacao("Erro ao salvar veículo. Verifique os dados.");
    }
  };

  const handleEditar = (veiculo) => {
    setEditando(true);
    setMostrarFormulario(true);
    setFormData({
      placa: veiculo.placa,
      id_modelo: veiculo.id_modelo,
      tipo: veiculo.tipo,
      ano_fabricacao: veiculo.ano_fabricacao,
      quilometragem: veiculo.quilometragem,
      cor: veiculo.cor,
      chassi: veiculo.chassi,
      situacao: veiculo.situacao,
    });
  };

  const handleExcluir = (veiculo) => {
    setVeiculoParaExcluir(veiculo);
    setMostrarModalConfirmacao(true);
  };

  const confirmarExclusao = async () => {
    try {
      if (veiculoParaExcluir) {
        await axios.delete(`${API_URL}/veiculos/${veiculoParaExcluir.placa}`);
        const response = await axios.get(`${API_URL}/veiculos`);
        setVeiculos(response.data);
        setMensagemModal(`Veículo ${veiculoParaExcluir.placa} excluído com sucesso!`);
        setMostrarModalSucesso(true);
        setMostrarModalConfirmacao(false);
      }
    } catch (error) {
      console.error("Erro ao excluir veículo:", error);
    }
  };
  
  const veiculosFiltrados = veiculos.filter((v) =>
    v.placa.toLowerCase().includes(busca.toLowerCase()) ||
    v.modelo_nome.toLowerCase().includes(busca.toLowerCase()) ||
    v.modelo_marca.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="pagina__veiculo">
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
        <h1>Veículos</h1>
        <Truck size={70} color="#000" />
      </div>

      {mostrarFormulario ? (
        <div className="formulario__container__funcionarios" style={{width: '900px'}}>
          <div className="formulario__titulo__funcionarios">
            {editando ? "Editar Veículo" : "Cadastro de Veículo"}
          </div>

          <div className="formulario__campo__funcionarios"><label>Placa*</label><input type="text" name="placa" value={formData.placa} onChange={handleInputChange} maxLength={8} disabled={editando} /></div>
          <div className="formulario__campo__funcionarios"><label>Modelo*</label>
            <select name="id_modelo" value={formData.id_modelo} onChange={handleInputChange}>
              <option value="">Selecione um modelo</option>
              {modelos.map(m => <option key={m.id} value={m.id}>{m.nome} ({m.marca})</option>)}
            </select>
          </div>
          <div className="formulario__campo__funcionarios"><label>Tipo*</label>
            <select name="tipo" value={formData.tipo} onChange={handleInputChange}>
              <option value="">Selecione</option><option value="Caminhão Refrigerado">Caminhão Refrigerado</option><option value="Sider">Sider</option><option value="Graneleiro">Graneleiro</option><option value="Câmara Fria">Câmara Fria</option><option value="Carreta Tanque">Carreta Tanque</option><option value="V.U.C">V.U.C</option>
            </select>
          </div>
          <div className="formulario__campo__funcionarios"><label>Ano Fabricação*</label><input type="number" name="ano_fabricacao" value={formData.ano_fabricacao} onChange={handleInputChange} /></div>
          <div className="formulario__campo__funcionarios"><label>Quilometragem*</label><input type="number" name="quilometragem" value={formData.quilometragem} onChange={handleInputChange} /></div>
          <div className="formulario__campo__funcionarios"><label>Cor</label><input type="text" name="cor" value={formData.cor} onChange={handleInputChange} /></div>
          <div className="formulario__campo__funcionarios"><label>Chassi*</label><input type="text" name="chassi" value={formData.chassi} onChange={handleInputChange} maxLength={17} /></div>
          <div className="formulario__campo__funcionarios"><label>Situação*</label>
            <select name="situacao" value={formData.situacao} onChange={handleInputChange}>
              <option value="Ativo">Ativo</option><option value="Inativo">Inativo</option>
            </select>
          </div>

          {erroValidacao && <div className="erro__mensagem__setor" style={{gridColumn: '1 / -1'}}>{erroValidacao}</div>}

          <div className="formulario__acoes__funcionarios">
            <button className="gravar" onClick={handleGravar}>Gravar</button>
          </div>
        </div>
      ) : (
        <>
          <div className="acoes">
            <div className="barra__pesquisa">
              <Search className="icone__pesquisa" size={28} color="black" />
              <input type="text" placeholder="Pesquisar por placa, modelo ou marca..." value={busca} onChange={(e) => setBusca(e.target.value)} />
            </div>
          </div>
          <div className="tabela__container">
            <table>
              <thead><tr><th>Placa</th><th>Modelo</th><th>Marca</th><th>Tipo</th><th>Ano</th><th>KM</th><th>Chassi</th><th>Situação</th><th>Ações</th></tr></thead>
              <tbody>
                {carregando ? ( <tr><td colSpan="9">Carregando...</td></tr> ) 
                : veiculosFiltrados.length > 0 ? (
                  veiculosFiltrados.map((v) => (
                    <tr key={v.placa}>
                      <td>{v.placa}</td>
                      <td>{v.modelo_nome}</td>
                      <td>{v.modelo_marca}</td>
                      <td>{v.tipo}</td>
                      <td>{v.ano_fabricacao}</td>
                      <td>{v.quilometragem}</td>
                      <td>{v.chassi}</td>
                      <td>{v.situacao}</td>
                      <td className="acao__botoes__modelo">
                        <button className="editar" onClick={() => handleEditar(v)}>Editar</button>
                        <button className="excluir" onClick={() => handleExcluir(v)}>Excluir</button>
                      </td>
                    </tr>
                  ))
                ) : ( <tr><td colSpan="9">Nenhum veículo encontrado</td></tr> )}
              </tbody>
            </table>
          </div>
          <div className="cadastrar__container">
            <button className="cadastrar" onClick={() => { setMostrarFormulario(true); limparFormulario(); }}>
              Cadastrar Veículo
            </button>
          </div>
        </>
      )}

      {mostrarModalConfirmacao && (
        <div className="modal__fundo__veiculo">
          <div className="modal__confirmacao__veiculo">
            <button
              className="modal__fechar__veiculo"
              onClick={() => setMostrarModalConfirmacao(false)}
            >
              <X size={26} />
            </button>
            <p>
              Você está prestes a excluir permanentemente o veículo{" "}
              <strong>{veiculoParaExcluir?.placa}</strong>.
              <br /> Esta ação é irreversível.
            </p>
            <div className="modal__botoes__veiculo">
              <button className="modal__botao__excluir__veiculo" onClick={confirmarExclusao}>
                Excluir Permanentemente
              </button>
              <button
                className="modal__botao__cancelar__veiculo"
                onClick={() => setMostrarModalConfirmacao(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarModalSucesso && (
        <div className="modal__fundo__veiculo">
          <div className="modal__sucesso__veiculo">
            <button
              className="modal__fechar__veiculo"
              onClick={() => setMostrarModalSucesso(false)}
            >
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
