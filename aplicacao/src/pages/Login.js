import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../style/login.css";
import logo from "../img/logo.png";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();


const handleSubmit = (event) => {
  event.preventDefault();
  axios.post('http://localhost:3001/login', { usuario, senha })
    .then(res => {
      if (res.data.status === "Success") {
        // UTILIZA DADOS DO BACKEND
        const { usuario } = res.data;
        
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
        
        navigate("/menu");
      } else {
        alert(res.data.message);
      }
    })
    .catch(err => {
      console.error("Erro na requisição de login:", err);
      alert("Ocorreu um erro ao tentar fazer login.");
    });
};

  return (
    <div className="login__caixa">
      <img src={logo} alt="Logo da empresa" className="login__logo" />

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <h1>Login</h1>

        <div className="login__campo">
          <label htmlFor="usuario">Usuário</label>
          <input
            type="text"
            id="usuario"
            required
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>

        <div className="login__campo">
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <button type="submit" className="login__botao">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;