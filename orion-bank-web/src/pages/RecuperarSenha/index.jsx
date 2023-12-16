import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { showErrorNotification } from '../../shared/notificationUtils';
import { RecuperarSenhaContext } from "../../contexts/RecuperarSenhaContext";
import InputMask from 'react-input-mask';
import "./styles.css"

const RecuperarSenha = () => {
    const recuperarSenhaContext = useContext(RecuperarSenhaContext);
    const enviarEmailRecuperacao = recuperarSenhaContext.enviarEmailRecuperacao;
    const recuperarSenha = recuperarSenhaContext.recuperarSenha;
    const location = useLocation();
    const [documento, setDocumento] = useState("");
    const [codigo, setCodigo] = useState("");
    const [token, setToken] = useState("");
    const [senha, setSenha] = useState("");
    const [senhaRepetida, setSenhaRepetida] = useState("");
    const [isAlteracao, setIsAlteracao] = useState(false);
    const [senhaDiferente, setSenhaDiferente] = useState(false);
    const [botaoDisabled, setBotaoDisabled] = useState(false);

    //#region Chamadas

    const enviarEmailSenha = async (e) => {
        e.preventDefault();
        setBotaoDisabled(true);

        if (documento === undefined || documento.replace(/\D/g, '').length < 11) {
            showErrorNotification("Preencha um documento válido.");
            return;
        }

        await enviarEmailRecuperacao(documento.replace(/\D/g, ''));
        setBotaoDisabled(false);
    };

    const alterarSenha = async (e) => {
        e.preventDefault();
        setBotaoDisabled(true);
        if (!validarCampos()){
            return;
        }
        
        const request = {
            codigo: codigo,
            token: token,
            senha: senha
        }

        await recuperarSenha(request);
        setBotaoDisabled(false);
    };

    //#endregion

    //#region Utildades

    const verificarRepeticao = async (e) => {
        setSenhaRepetida(e);

        if (senha === e){
            setSenhaDiferente(false);
        } else {
            setSenhaDiferente(true);
        }
    }

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const codigo = searchParams.get('codigo');
        const token = searchParams.get('token');
        if (codigo && token) {
            setCodigo(codigo);
            setToken(token);
            setIsAlteracao(true);
        }
    }, [location.search]);

    //#endregion

    const validarCampos = () => {
        if (senha === ""){
            showErrorNotification(`Os campos de senha são obrigatórios.`);
            return false;
        }

        if (senha !== senhaRepetida){
            showErrorNotification(`As senhas não coincidem.`);
            return false;
        }

        if (senha.length < 8){
            showErrorNotification(`A senha precisa ter no mínimo 8 digitos.`);
            return false;
        }

        return true;
    }

    return (
        <div className="container">
            <div className="row justify-content-center align-items-center vh-100">
                <div className="col-xl-10 col-lg-12 col-md-9 ">
                    <div className="card o-hidden border-0 shadow-lg my-5">
                        <div className="card-body p-0 ">
                            <div className="row">
                                <div className="col-lg-6 p-2">
                                    <div className="p-5">
                                        <div className="text-center">
                                            <h1 style={{ color: '#DB4648' }} className="h2 mb-4"> Recuperar Senha</h1>
                                        </div>

                                        {!isAlteracao && (
                                            <>
                                                <div className="div-texto-senha">
                                                    <div className="textoSenha">
                                                        <label>
                                                            Informe o CPF associado à sua conta para alterar sua senha.
                                                        </label>
                                                    </div>
                                                </div>

                                                <form className="user" onSubmit={enviarEmailSenha}>
                                                    <div className="campos-recuperar">
                                                        <div className="form-group">
                                                            <InputMask
                                                                mask="999.999.999-99"
                                                                type="text"
                                                                className="cpf form-control"
                                                                id="cpf"
                                                                aria-describedby="cpfHelp"
                                                                placeholder="CPF"
                                                                value={documento}
                                                                onChange={(e) => setDocumento(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="form-group">
                                                        <button type="submit" disabled={botaoDisabled} className="botao-um"> Recuperar </button>
                                                        <Link to="/login"><button type="button" className="botao-dois"> Cancelar </button></Link>
                                                    </div>
                                                </form>
                                            </>
                                        )}

                                        {isAlteracao && (
                                            <>
                                                <div className="div-texto-alteracao-senha">
                                                    <div className="textoSenha">
                                                        <label>
                                                            A senha deve conter:
                                                            <ul>
                                                                <li>No mínimo 8 dígitos;</li>
                                                                <li>Pelo menos um caractere especial;</li>
                                                                <li>Pelo menos uma letra maiúscula;</li>
                                                                <li>Pelo menos uma letra minúscula;</li>
                                                                <li>Pelo menos um número.</li>
                                                            </ul>
                                                        </label>
                                                    </div>
                                                </div>

                                                <form className="user" onSubmit={alterarSenha}>
                                                    <div className="campos-alterar">
                                                        <div className="form-group">
                                                            <input
                                                                type="password"
                                                                className="senha form-control"
                                                                id="senha"
                                                                aria-describedby="senhaHelp"
                                                                placeholder="Senha"
                                                                maxLength={25}
                                                                value={senha}
                                                                onChange={(e) => setSenha(e.target.value)}
                                                            />
                                                        </div>

                                                        <div className="form-group">
                                                            <input
                                                                type="password"
                                                                className="senha form-control"
                                                                id="senha-repetida"
                                                                aria-describedby="senhaHelp"
                                                                placeholder="Repetir Senha"
                                                                maxLength={25}
                                                                value={senhaRepetida}
                                                                onChange={(e) => verificarRepeticao(e.target.value)}
                                                            />
                                                            {senhaDiferente && (
                                                                <div className="text-right">
                                                                    <label className="senhas-dif">As senhas não coincidem.</label>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="form-group">
                                                        <button type="submit" disabled={botaoDisabled} className="botao-um"> Recuperar </button>
                                                        <Link to="/login"><button type="button" className="botao-dois"> Cancelar </button></Link>
                                                    </div>
                                                </form>
                                            </>
                                        )}


                                    </div>
                                </div>

                                {!isAlteracao && (
                                    <div className="col-lg-6 d-none d-lg-block bg-forgot-password-image"></div>
                                )}

                                {isAlteracao && (
                                    <div className="col-lg-6 d-none d-lg-block bg-alterar-password-image"></div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecuperarSenha;