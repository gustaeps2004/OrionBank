import React, { useState, useContext, useEffect } from "react";
import InputMask from 'react-input-mask';
import Circulo from "../../assets/img/circulo.svg";
import CirculoPreto from "../../assets/img/circulo-preto.svg"
import Avancar from "../../assets/img/avancar.svg";
import Retroceder from "../../assets/img/retroceder.svg";
import { showErrorNotification } from '../../shared/notificationUtils';
import { Link } from "react-router-dom";
import { SolicitacoesContaContext } from "../../contexts/SolicitacoesContaContext";
import { BuscarCEPContext } from "../../contexts/BuscarCEPContext";
import { parse, isValid } from 'date-fns';
import "./styles.css";

const SolicitarConta = () => {
    //#region Declarações
    const solicitar = useContext(SolicitacoesContaContext).solicitar;
    const buscarCEPContext = useContext(BuscarCEPContext);
    const buscarCep = buscarCEPContext.buscarCep;
    const camposChecagem = [
        'nome',
        'sobrenome',
        'email',
        'dtNasc',
        'telefoneCelular',
        'estado',
        'cidade',
        'logradouro',
        'cep',
        'numero',
        'documentoFederal'];

    const [solicitacaoRequest, setSolicitacaoRequest] = useState({
        nome: "",
        sobrenome: "",
        email: "",
        dtNasc: "",
        telefoneCelular: "",
        estado: "",
        cidade: "",
        logradouro: "",
        cep: "",
        numero: "",
        documentoFederal: ""
    });
    //#endregion

    //#region BuscaCEP
    const [cepInput, setCepInput] = useState("");

    const buscarCEPDigitado = async () => {
        const response = await buscarCep(cepInput.replace(/\D/g, ''));

        if (response.localidade !== '') {
            setSolicitacaoRequest({
                ...solicitacaoRequest,
                cep: cepInput,
                logradouro: response?.logradouro ?? "",
                estado: response?.uf ?? "",
                cidade: response?.localidade ?? "",
            });
        }
    }

    useEffect(() => {
        if (cepInput !== solicitacaoRequest.cep && cepInput.replace(/\D/g, '').length === 8) {
            buscarCEPDigitado();
        }
    });

    const handleCepChange = (e) => {
        setCepInput(e.target.value);
    };
    //#endregion

    //#region Utilidades
    const [etapa, setEtapa] = useState(1);
    const [isChecked, setIsChecked] = useState(false);

    const avancarEtapa = () => {
        setEtapa(etapa + 1);
    };

    const retrocederEtapa = () => {
        setEtapa(etapa - 1);
    }

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };
    //#endregion

    const handleSubmit = async (e) => {
        e.preventDefault();

        validarPrenchimento();
        const todosPreenchidos = camposChecagem.every(fieldName => Boolean(solicitacaoRequest[fieldName]));

        if (!isChecked || !todosPreenchidos || !validarCampos())
            return;

        await solicitar(solicitacaoRequest);
    };

    //#region Validações
    const validarPrenchimento = () => {
        if (solicitacaoRequest.nome === "")
            showErrorNotification(`O campo Nome é obrigatório.`);

        if (solicitacaoRequest.sobrenome === "")
            showErrorNotification(`O campo Sobrenome é obrigatório.`);

        if (solicitacaoRequest.email === "")
            showErrorNotification(`O campo Email é obrigatório.`);

        if (solicitacaoRequest.dtNasc === "")
            showErrorNotification(`O campo Data de Nascimento é obrigatório.`);

        if (solicitacaoRequest.telefoneCelular === "")
            showErrorNotification(`O campo Telefone é obrigatório.`);

        if (solicitacaoRequest.cidade === "")
            showErrorNotification(`O campo Cidade é obrigatório.`);

        if (solicitacaoRequest.logadouro === "")
            showErrorNotification(`O campo Logadouro é obrigatório.`);

        if (solicitacaoRequest.cep === "")
            showErrorNotification(`O campo CEP é obrigatório.`);

        if (solicitacaoRequest.numero === "")
            showErrorNotification(`O campo Número é obrigatório.`);

        if (solicitacaoRequest.documentoFederal === "")
            showErrorNotification(`O campo Documento Federal é obrigatório.`);

        if (!isChecked)
            showErrorNotification("Aceite os termos e politica de privacidade.");
    };

    const validarCampos = () => {
        if (!validarData(solicitacaoRequest.dtNasc)) {
            showErrorNotification(`Informe uma Data de Nascimento válida.`);
            return false;
        }

        if (!validarEmail(solicitacaoRequest.email)) {
            showErrorNotification(`Informe um e-mail válido.`);
            return false;
        }

        return true;
    }

    function validarData(dataString) {
        const data = parse(dataString, 'dd/MM/yyyy', new Date());

        if (isValid(data)) {
            return true;
        } else {
            return false;
        }
    }

    function validarEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return regex.test(email);
    }
    //#endregion

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
                                            {etapa < 3 && (
                                                <>
                                                    <h1 style={{ color: '#DB4648' }} className="h2 mb-0">Solicitar Conta</h1>
                                                    <label className="subtitulo mb-4">Preencha os dados da conta</label>
                                                </>
                                            )}
                                            {etapa === 3 && (
                                                <>
                                                    <h1 style={{ color: '#DB4648' }} className="h2 mb-4">Solicitar Conta</h1>
                                                </>
                                            )}
                                        </div>

                                        <form className="user" onSubmit={handleSubmit}>
                                            {etapa === 1 && (
                                                <div className="campos">
                                                    <div className="form-group row">
                                                        <div className="col-sm-6 mb-3 mb-sm-0">
                                                            <input
                                                                type="text"
                                                                className="name form-control"
                                                                id="name"
                                                                aria-describedby="nameHelp"
                                                                placeholder="Nome"
                                                                value={solicitacaoRequest.nome}
                                                                onChange={(e) => setSolicitacaoRequest({ ...solicitacaoRequest, nome: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <input
                                                                type="text"
                                                                className="sobrenome form-control"
                                                                id="sobrenome"
                                                                aria-describedby="sobrenomeHelp"
                                                                placeholder="Sobrenome"
                                                                value={solicitacaoRequest.sobrenome}
                                                                onChange={(e) => setSolicitacaoRequest({ ...solicitacaoRequest, sobrenome: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="form-group row">
                                                        <div className="col-sm-12 mb-0 mb-sm-0">
                                                            <input
                                                                type="email"
                                                                className="email form-control"
                                                                id="email"
                                                                aria-describedby="emailHelp"
                                                                placeholder="E-mail"
                                                                value={solicitacaoRequest.email}
                                                                onChange={(e) => setSolicitacaoRequest({ ...solicitacaoRequest, email: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="form-group row">
                                                        <div className="col-sm-6 mb-3 mb-sm-0">
                                                            <InputMask
                                                                type="text"
                                                                mask="99/99/9999"
                                                                className="date form-control"
                                                                id="dtNasc"
                                                                aria-describedby="dateHelp"
                                                                placeholder="Nascimento"
                                                                value={solicitacaoRequest.dtNasc}
                                                                onChange={(e) => setSolicitacaoRequest({ ...solicitacaoRequest, dtNasc: e.target.value })}
                                                            />
                                                        </div>

                                                        <div className="col-sm-6">
                                                            <InputMask
                                                                type="phone"
                                                                mask="(99) 99999-9999"
                                                                className="phone form-control"
                                                                id="phone"
                                                                aria-describedby="phoneHelp"
                                                                placeholder="Telefone Celular"
                                                                value={solicitacaoRequest.telefoneCelular}
                                                                onChange={(e) => setSolicitacaoRequest({ ...solicitacaoRequest, telefoneCelular: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="form-group row">
                                                        <div className="col-sm-12 mb-0 mb-sm-0">
                                                            <InputMask
                                                                type="text"
                                                                mask="999.999.999-99"
                                                                className="documento form-control"
                                                                id="documento"
                                                                aria-describedby="documentoHelp"
                                                                placeholder="Documento Federal"
                                                                value={solicitacaoRequest.documentoFederal}
                                                                onChange={(e) => setSolicitacaoRequest({ ...solicitacaoRequest, documentoFederal: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {etapa === 2 && (
                                                <div className="campos">
                                                    <div className="form-group row">
                                                        <div className="col-sm-6 mb-3 mb-sm-0">
                                                            <input
                                                                type="text"
                                                                className="cep form-control"
                                                                id="cep"
                                                                aria-describedby="cepHelp"
                                                                placeholder="CEP"
                                                                maxLength={9}
                                                                value={cepInput}
                                                                onChange={handleCepChange}
                                                            />
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <input
                                                                type="text"
                                                                className="numero form-control"
                                                                id="numero"
                                                                aria-describedby="numeroHelp"
                                                                placeholder="Número"
                                                                maxLength={10}
                                                                value={solicitacaoRequest.numero}
                                                                onChange={(e) => setSolicitacaoRequest({ ...solicitacaoRequest, numero: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="form-group row">
                                                        <div className="col-sm-6 mb-3 mb-sm-0">
                                                            <input
                                                                type="text"
                                                                className="estado form-control"
                                                                id="estado"
                                                                aria-describedby="estadoHelp"
                                                                placeholder="Estado"
                                                                value={solicitacaoRequest.estado}
                                                                disabled
                                                            />
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <input
                                                                type="text"
                                                                className="cidade form-control"
                                                                id="cidade"
                                                                aria-describedby="cidadeHelp"
                                                                placeholder="Cidade"
                                                                value={solicitacaoRequest.cidade}
                                                                disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="form-group row">
                                                        <div className="col-sm-12 mb-0 mb-sm-0">
                                                            <input
                                                                type="text"
                                                                className="logradouro form-control"
                                                                id="logradouro"
                                                                aria-describedby="logradourooHelp"
                                                                placeholder="Logradouro"
                                                                value={solicitacaoRequest.logradouro}
                                                                disabled
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {etapa === 3 && (
                                                <div className="campoEtapaTres">
                                                    <div className="campos">
                                                        <div className="textoFinal">
                                                            <label>Confirme os dados preenchidos e prossiga para a criação da conta.</label>
                                                        </div>
                                                        <div className="checkboxForm">
                                                            <input
                                                                className="checkbox"
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="label-check-box">
                                                                Eu concordo com os
                                                                <Link className="termos" target="_blank" to="/termosPoliticas"> Termos </Link>
                                                                e
                                                                <Link className="termos" target="_blank" to="/termosPoliticas"> Politica de privacidade</Link>.
                                                            </label>
                                                        </div>

                                                        <div className="form-group">
                                                            <button type="submit" className="botao-um"> Enviar </button>
                                                            <Link to="/login"><button type="button" className="botao-dois"> Cancelar </button></Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="slideGroup">

                                                {etapa > 1 && (
                                                    <img src={Retroceder} className="flecha" alt="" onClick={retrocederEtapa} />
                                                )}

                                                {etapa === 1 && (
                                                    <>
                                                        <div className="preenche" />
                                                        <div className="slide">
                                                            <img src={CirculoPreto} className="circulo-preto" alt="" />
                                                            <img src={Circulo} className="slideTres" alt="" />
                                                            <img src={Circulo} className="slideTres" alt="" />
                                                        </div>
                                                    </>
                                                )}

                                                {etapa === 2 && (
                                                    <div className="slide">
                                                        <img src={CirculoPreto} className="circulo-preto" alt="" />
                                                        <img src={CirculoPreto} className="circulo-preto" alt="" />
                                                        <img src={Circulo} className="slideTres" alt="" />
                                                    </div>
                                                )}

                                                {etapa === 3 && (
                                                    <>
                                                        <div className="slide">
                                                            <img src={CirculoPreto} className="circulo-preto" alt="" />
                                                            <img src={CirculoPreto} className="circulo-preto" alt="" />
                                                            <img src={CirculoPreto} className="circulo-preto" alt="" />
                                                        </div>
                                                        <div className="preenche" />
                                                    </>
                                                )}

                                                {etapa < 3 && (
                                                    <img src={Avancar} className="flecha" alt="" onClick={avancarEtapa} />
                                                )}
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                {etapa === 1 && (
                                    <div className="col-lg-5 d-none d-lg-block bg-solicitar-image"></div>
                                )}

                                {etapa === 2 && (
                                    <div className="col-lg-5 d-none d-lg-block bg-solicitar-image-dois"></div>
                                )}

                                {etapa === 3 && (
                                    <div className="col-lg-5 d-none d-lg-block bg-solicitar-image-tres"></div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SolicitarConta;