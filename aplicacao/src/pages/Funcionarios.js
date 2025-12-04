import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Search, X } from "lucide-react";
import axios from "axios";
import logo from "../img/logo.png";
import "../style/funcionarios.css"; 
import "../style/setores.css"; 

const API_URL = "http://localhost:3001";

export default function Funcionarios() {
    const navigate = useNavigate();

    // Estados do componente
    const [funcionarios, setFuncionarios] = useState([]);
    const [setores, setSetores] = useState([]);
    const [busca, setBusca] = useState("");
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editando, setEditando] = useState(false);
    const [funcionarioEditandoId, setFuncionarioEditandoId] = useState(null);

    // DADOS DO FORMULARIO
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        data_admissao: '',
        situacao: 'Ativo',
        id_setor: '',
        login: '',
        senha: ''
    });

    // CARREGAR DADOS DO BACKEND
    useEffect(() => {
        const carregarDados = async () => {
            try {
                const [resFuncionarios, resSetores] = await Promise.all([
                    axios.get(`${API_URL}/funcionarios`),
                    axios.get(`${API_URL}/setores`)
                ]);
                setFuncionarios(resFuncionarios.data);
                setSetores(resSetores.data);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
        };
        carregarDados();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleGravar = async () => {
        // CAMPOS OBRIGATÓRIOS
        if (!formData.nome || !formData.cpf || !formData.data_admissao || !formData.id_setor) {
            alert("Preencha todos os campos obrigatórios (*)");
            return;
        }

        // DADOS DO CPF FORMATADOS
        const dadosParaSalvar = {
            ...formData,
            cpf: formData.cpf.replace(/\D/g, ""), 
            login: formData.login || null,
            senha: formData.senha || null         
        };

        try {
            if (editando) {
                await axios.put(`${API_URL}/funcionarios/${funcionarioEditandoId}`, dadosParaSalvar);
            } else {
                await axios.post(`${API_URL}/funcionarios`, dadosParaSalvar);
            }
            
            const response = await axios.get(`${API_URL}/funcionarios`);
            setFuncionarios(response.data);
            setMostrarFormulario(false);
            resetForm();
        } catch (error) {
            console.error("Erro ao salvar funcionário:", error);
            alert("Erro ao salvar. Verifique o console.");
        }
    };

    const handleEditar = (func) => {
        setEditando(true);
        setFuncionarioEditandoId(func.id);
        setFormData({
            nome: func.nome,
            cpf: func.cpf,
            data_admissao: func.data_admissao,
            situacao: func.situacao,
            id_setor: setores.find(s => s.nome === func.setor)?.id || '',
            login: '',
            senha: ''  
        });
        setMostrarFormulario(true);
    };

    const handleExcluir = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este funcionário?")) {
            try {
                await axios.delete(`${API_URL}/funcionarios/${id}`);
                setFuncionarios(funcionarios.filter(f => f.id !== id));
            } catch (error) {
                console.error("Erro ao excluir funcionário:", error);
                alert("Erro ao excluir. Verifique o console.");
            }
        }
    };

    const resetForm = () => {
        setEditando(false);
        setFuncionarioEditandoId(null);
        setFormData({
            nome: '', cpf: '', data_admissao: '', situacao: 'Ativo', id_setor: '', login: '', senha: ''
        });
    };

    const funcionariosFiltrados = funcionarios.filter(f =>
        f.nome.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div className="pagina__funcionarios">
            <header className="funcionarios__header">
                <img src={logo} alt="Transvicon Logística" className="logo" />
                <button className="botao__voltar" onClick={() => navigate("/gerenciamento")}>
                    ⬅ Voltar
                </button>
            </header>

            <div className="titulo__central__funcionarios">
                <h1>Funcionários</h1>
                <Users size={70} color="#000" />
            </div>

            {mostrarFormulario ? (
                // FORMULARIO PARA CADASTRAR E EDITAR
                <div>
                    <div className="formulario__container__funcionarios">
                        <div className="formulario__titulo__funcionarios">
                            {editando ? "Editar Funcionário" : "Cadastrar Funcionário"}
                        </div>
                        {/* CAMPOS DO FORMULARIO */}
                        <div className="formulario__campo__funcionarios"><label>Nome*</label><input type="text" name="nome" value={formData.nome} onChange={handleInputChange} /></div>
                        <div className="formulario__campo__funcionarios"><label>CPF*</label><input type="text" name="cpf" value={formData.cpf} onChange={handleInputChange} /></div>
                        <div className="formulario__campo__funcionarios"><label>Data de Admissão*</label><input type="date" name="data_admissao" value={formData.data_admissao} onChange={handleInputChange} /></div>
                        <div className="formulario__campo__funcionarios"><label>Situação</label><select name="situacao" value={formData.situacao} onChange={handleInputChange}><option value="Ativo">Ativo</option><option value="Inativo">Inativo</option></select></div>
                        <div className="formulario__campo__funcionarios"><label>Setor*</label><select name="id_setor" value={formData.id_setor} onChange={handleInputChange}><option value="">Selecione...</option>{setores.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}</select></div>
                        <div className="formulario__campo__funcionarios"><label>Login</label><input type="text" name="login" value={formData.login} onChange={handleInputChange} /></div>
                        <div className="formulario__campo__funcionarios"><label>Senha</label><input type="password" name="senha" value={formData.senha} onChange={handleInputChange} placeholder={editando ? "Deixe em branco para não alterar" : ""} /></div>

                        <div className="formulario__acoes__funcionarios">
                            <button className="gravar" onClick={handleGravar}>Gravar</button>
                            <button className="modal__botao--cancelar" onClick={() => { setMostrarFormulario(false); resetForm(); }} style={{marginLeft: '15px'}}>Cancelar</button>
                        </div>
                    </div>
                </div>
            ) : (
                // LISTA
                <>
                    <div className="acoes">
                        <div className="barra__pesquisa">
                            <Search className="icone__pesquisa" size={28} color="black" />
                            <input type="text" placeholder="Pesquisar funcionário" value={busca} onChange={(e) => setBusca(e.target.value)} />
                        </div>
                    </div>
                    <div className="tabela__container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>CPF</th>
                                    <th>Setor</th>
                                    <th>Situação</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {funcionariosFiltrados.map(func => (
                                    <tr key={func.id}>
                                        <td>{func.id}</td>
                                        <td>{func.nome}</td>
                                        <td>{func.cpf}</td>
                                        <td>{func.setor}</td>
                                        <td>{func.situacao}</td>
                                        <td style={{ textAlign: "right", paddingRight: "60px" }}>
                                            <button className="editar" onClick={() => handleEditar(func)}>Editar</button>
                                            <button className="excluir" onClick={() => handleExcluir(func.id)}>Excluir</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="cadastrar__container">
                        <button className="cadastrar" onClick={() => { setMostrarFormulario(true); resetForm(); }}>
                            Cadastrar Funcionário
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}