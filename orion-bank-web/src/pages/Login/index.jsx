import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { showErrorNotification } from '../../shared/notificationUtils';
import InputMask from 'react-input-mask';
import Titulo from "../../assets/img/titulo.svg";
import "./styles.css";

const Login = () => {
    const authContext = useContext(AuthContext);
    const login = authContext.login;
    const [botaoDisabled, setBotaoDisabled] = useState(false);
    const [autenticarRequest, setAutenticarRequest] = useState({ login: "", senha: "" });


    const handleSubmit = (e) => {
        e.preventDefault();
        setBotaoDisabled(true);

        autenticarRequest.login = autenticarRequest.login.replace(/\D/g, '');

        if (validarPrenchimento())
            login(autenticarRequest);
        else
            showErrorNotification("Preencha todos os campos!");

        setBotaoDisabled(false);
    };

    const validarPrenchimento = () => {
        if (autenticarRequest.login !== "" && autenticarRequest.senha !== "") {
            return true;
        } else {
            return false;
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center align-items-center vh-100">
                <div className="col-xl-10 col-lg-12 col-md-9">
                    <div className="card o-hidden border-0 shadow-lg my-5">
                        <div className="card-body p-0">
                            <div className="row">
                                <div className="col-lg-7">
                                    <div className="p-5">
                                        <div className="text-center">
                                            <img src={Titulo} className="circulo-preto" alt="" draggable="false" />
                                            <h1 style={{ color: 'black', opacity: '70%' }} className="h4 mb-4 mt-0">Login</h1>
                                        </div>

                                        <form className="user" onSubmit={handleSubmit}>
                                            <div className="form-group">
                                                <InputMask
                                                    mask="999.999.999-99"
                                                    type="text"
                                                    className="cpf form-control"
                                                    id="cpf"
                                                    aria-describedby="cpfHelp"
                                                    placeholder="CPF"
                                                    value={autenticarRequest.login}
                                                    onChange={(e) => setAutenticarRequest({ ...autenticarRequest, login: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="password"
                                                    className="password form-control"
                                                    id="password"
                                                    placeholder="Senha"
                                                    name="nome"
                                                    value={autenticarRequest.senha}
                                                    onChange={(e) => setAutenticarRequest({ ...autenticarRequest, senha: e.target.value })}
                                                />
                                                <div className="text-right">
                                                    <Link to="/recuperar" className="forgot small">Esqueceu sua senha?</Link>
                                                </div>
                                            </div>

                                            <div className="buttonsLogin form-group">
                                                <button type="submit" disabled={botaoDisabled} className="botao-um"> Login </button>
                                                <Link to="/solicitarConta"><button type="submit" className="botao-dois"> Solicitar Conta </button></Link>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-lg-5 d-none d-lg-block bg-login-image"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;