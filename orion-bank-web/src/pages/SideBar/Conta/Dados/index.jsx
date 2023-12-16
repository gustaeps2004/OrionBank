import React, { useContext, useState, useEffect } from "react";
import { ContaContext } from "../../../../contexts/ContaContext";
import PersonLock from "../../../../assets/img/person-lock.svg";
import "./styles.css"

const Dados = () => {
    const { buscarInfoConta } = useContext(ContaContext);
    const [responseConsulta, setResponseConsulta] = useState({
        Agencia: '',
        Conta: '',
        ContaDigito: '',
        DocumentoFederal: '',
        NomeCompleto: '',
        DtNasc: '',
        Email: '',
        TelefoneCelular: '',
        CEP: '',
        Logradouro: '',
        NumeroResidencial: ''
    });

    useEffect(() => {
        const buscarConta = async () => {
            const response = await buscarInfoConta();
            setResponseConsulta(response);
        }
        buscarConta();
    }, []);

    const formatarCPF = (cpf) => {
        if (cpf !== undefined) {
            return (
                cpf.substring(0, 3) +
                "." +
                cpf.substring(3, 6) +
                "." +
                cpf.substring(6, 9) +
                "-" +
                cpf.substring(9)
            );
        }
    };

    function formatarData(data) {
        if (data) {
            const dataObj = new Date(data);
            const dia = String(dataObj.getUTCDate()).padStart(2, '0');
            const mes = String(dataObj.getUTCMonth() + 1).padStart(2, '0');
            const ano = dataObj.getUTCFullYear();
            return `${dia}/${mes}/${ano}`;
        }
    }

    function formatarTelefone(telefone) {
        if (telefone !== undefined) {
            const regexFormato = /^(\d{2})(\d{5})(\d{4})$/;
            const numeroFormatado = telefone.replace(regexFormato, '($1) $2-$3');
            return numeroFormatado;
        }
    }

    function formatarCEP(cep) {
        if (cep !== undefined) {
            const regexFormato = /^(\d{5})(\d{3})$/;
            const cepFormatado = cep.replace(regexFormato, '$1-$2');
            return cepFormatado;
        }
    }

    return (
        <div className="container-dados">
            <div className="title-dados">
                <h3 className="titulo-h5"> <img alt="" src={PersonLock}></img> Dados</h3>
            </div>
            <div className="card-dados">
                <div className="div-descricao-conta">
                    <h5>Suas informações da conta.</h5>
                </div>
                <div className="card-dados-conta">
                    <div className="inputs-dados">
                        <div>
                            <label style={{ color: "#3f3d56" }}>Agência</label>
                            <input
                                type="text"
                                className="form-control"
                                disabled
                                value={responseConsulta.Agencia}
                            />
                        </div>
                        <div>
                            <label style={{ color: "#3f3d56" }}>Conta</label>
                            <input
                                type="text"
                                className="form-control"
                                disabled
                                value={responseConsulta.Conta}
                            />
                        </div>
                        <div>
                            <label style={{ color: "#3f3d56" }}>Conta Dígito</label>
                            <input
                                type="text"
                                className="form-control"
                                disabled
                                value={responseConsulta.ContaDigito}
                            />
                        </div>
                        <div>
                            <label style={{ color: "#3f3d56" }}>Conta Pagamento</label>
                            <input
                                type="text"
                                className="form-control"
                                disabled
                                value={responseConsulta.Conta + "-" + responseConsulta.ContaDigito}
                            />
                        </div>
                        <div>
                            <label style={{ color: "#3f3d56" }}>Nome</label>
                            <input
                                type="text"
                                className="form-control"
                                disabled
                                value={responseConsulta.NomeCompleto}
                            />
                        </div>
                        <div>
                            <label style={{ color: "#3f3d56" }}>Documento Federal</label>
                            <input
                                type="text"
                                className="form-control"
                                disabled
                                value={formatarCPF(responseConsulta.DocumentoFederal)}
                            />
                        </div>
                        <div>
                            <label style={{ color: "#3f3d56" }}>Data de Nascimento</label>
                            <input
                                type="text"
                                className="form-control"
                                disabled
                                value={formatarData(responseConsulta.DtNasc)}
                            />
                        </div>
                        <div>
                            <label style={{ color: "#3f3d56" }}>E-mail</label>
                            <input
                                type="text"
                                className="form-control"
                                disabled
                                value={responseConsulta.Email}
                            />
                        </div>
                        <div>
                            <label style={{ color: "#3f3d56" }}>Telefone Celular</label>
                            <input
                                type="text"
                                className="form-control"
                                disabled
                                value={formatarTelefone(responseConsulta.TelefoneCelular)}
                            />
                        </div>
                        <div>
                            <label style={{ color: "#3f3d56" }}>CEP</label>
                            <input
                                type="text"
                                className="form-control"
                                disabled
                                value={formatarCEP(responseConsulta.CEP)}
                            />
                        </div>
                        <div className="logradouto-conta">
                            <label style={{ color: "#3f3d56" }}>Logradouro</label>
                            <input
                                type="text"
                                className="form-control"
                                disabled
                                value={responseConsulta.Logradouro}
                            />
                        </div>
                        <div className="logradouto-conta">
                            <label style={{ color: "#3f3d56" }}>Número Residencial</label>
                            <input
                                type="text"
                                className="form-control"
                                disabled
                                value={responseConsulta.NumeroResidencial}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dados;