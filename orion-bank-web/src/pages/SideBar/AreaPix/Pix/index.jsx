import React, { useState, useContext, useEffect } from "react";
import { TipoChavePixEnum } from '../../../../constants/enums';
import { showErrorNotification, showSuccessNotification } from '../../../../shared/notificationUtils';
import { ChaveContext } from "../../../../contexts/ChaveContext";
import { QRCodeContext } from "../../../../contexts/QRCodeContext";
import { MovimentoContext } from "../../../../contexts/MovimentoContext";
import QRScanner from "../../../../components/QRScanner";
import CurrencyInput from "../../../../components/MoneyInput";
import Icon from "../../../../assets/img/pix-icon.svg";
import NotFound from "../../../../assets/img/undraw_no_data.svg";
import EMVImage from "../../../../assets/img/background-qrcode.svg";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import "./styles.css"

const Pix = () => {
    const { consultarChavePix } = useContext(ChaveContext);
    const { consultarDadosEMV } = useContext(QRCodeContext);
    const { enviarPixViaChave, enviarPixViaEMV } = useContext(MovimentoContext);
    const [modalPixChaveIsOpen, setOpenModalPixChave] = useState(false);
    const [modalPixCopiaColaIsOpen, setOpenModalPixCopiaCola] = useState(false);
    const [modalLerQrCodeOpen, setOpenModalLerQrCode] = useState(false);
    const [chavesFavoritas, setChavesFavoritas] = useState([]);
    const [chavePix, setChavePix] = useState('');
    const [EMV, setEMV] = useState('');
    const [valor, setValor] = useState('R$ 0,00');
    const [infoIsOn, setInfoIsOn] = useState(false);
    const [infoAdicional, setInfoAdicional] = useState('');
    const [responseConsulta, setResponseConsulta] = useState({});
    const [qrCodeResult, setQRCodeResult] = useState('');
    const [botaoDisabled, setBotaoDisabled] = useState(false);

    const openModalPixChave = () => {
        setOpenModalPixChave(true);
    };

    const closeModalPixChave = () => {
        setChavePix('');
        setValor('R$ 0,00');
        setInfoAdicional('');
        setResponseConsulta({});
        setChavesFavoritas([]);
        setEtapa(1);
        setOpenModalPixChave(false);
        setBotaoDisabled(false);
    };

    const openModalPixCopiaCola = () => {
        setOpenModalPixCopiaCola(true);
    };

    const closeModalPixCopiaCola = () => {
        setOpenModalPixCopiaCola(false);
        setResponseConsulta({});
        setEtapa(1);
        setEMV('');
        setInfoAdicional('');
        setBotaoDisabled(false);
    };

    const openModalLerQrCode = () => {
        setOpenModalLerQrCode(true);
    };

    const closeModalLerQrCode = () => {
        setOpenModalLerQrCode(false);
        setInfoAdicional('');
        setResponseConsulta({});
        setEtapa(1);
        setQRCodeResult('');
        setBotaoDisabled(false);
    };

    const [etapa, setEtapa] = useState(1);

    const avancarEtapa = async () => {
        const isValid = await validarAvancoEtapa();
        if (isValid) {
            setEtapa(etapa + 1);
        }
    };

    const retrocederEtapa = () => {
        setEtapa(etapa - 1);
    }

    const validarAvancoEtapa = async () => {
        if (modalPixChaveIsOpen) {
            switch (etapa) {
                case 1:
                    if (chavePix === "") {
                        showErrorNotification("Informe a chave pix.");
                        return false;
                    }

                    const response = await consultarChavePix(chavePix);
                    if (response === undefined) {
                        return false;
                    }
                    setResponseConsulta(response);
                    break;

                case 2:
                    if (formatarValor(valor) === 0) {
                        showErrorNotification("Informe o valor a pagar.");
                        return false;
                    }
                    break;

                default:
                    return false;
            }
        }

        if (modalPixCopiaColaIsOpen) {
            switch (etapa) {
                case 1:
                    if (EMV === "") {
                        showErrorNotification("Informe o código EMV.");
                        return false;
                    }

                    const response = await consultarDadosEMV(EMV);
                    if (response === undefined || response.length === 0) {
                        return false;
                    }
                    setResponseConsulta(response);
                    break;

                default:
                    return false;
            }
        }

        if (modalLerQrCodeOpen) {
            switch (etapa) {
                case 1:
                    if (qrCodeResult === '') {
                        showErrorNotification("Leia o QRCode.");
                        return false;
                    }

                    const response = await consultarDadosEMV(qrCodeResult);
                    if (response === undefined || response.length === 0) {
                        return false;
                    }

                    showSuccessNotification("QR Code encontrado!");
                    setResponseConsulta(response);
                    break;

                default:
                    return false;
            }
        }

        return true;
    };

    function formatarEnum(situacao) {
        switch (situacao) {
            case TipoChavePixEnum.CPF:
                return 'CPF';
            case TipoChavePixEnum.EMAIL:
                return 'Email';
            case TipoChavePixEnum.TELEFONE:
                return 'Telefone';
            default:
                return 'Desconhecida';
        }
    }

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

    const formatarValor = (value) => {
        if (value === "")
            return 0;

        const formattedValue = parseFloat(value.replace('R$ ', '').replace('.', '').replace(',', '.'));
        return formattedValue;
    };

    const enviarPixPorChave = async (e) => {
        e.preventDefault();
        setBotaoDisabled(true);
        const request = {
            codigoContaDestino: responseConsulta.Codigo,
            codigoContaOrigem: '',
            valor: formatarValor(valor),
            chavePix: chavePix,
            infoAdicional: infoAdicional
        }
        await enviarPixViaChave(request);
        closeModalPixChave();
        setBotaoDisabled(false);
    };

    const enviarPixPorEMV = async (e) => {
        e.preventDefault();
        setBotaoDisabled(true);
        const request = {
            codigoContaDestino: responseConsulta.Codigo,
            emv: EMV,
            valor: formatarValor(responseConsulta.Valor),
            infoAdicional: infoAdicional
        }
        await enviarPixViaEMV(request);
        closeModalPixCopiaCola();
        setBotaoDisabled(false);
    };

    const enviarPixPorQRCode = async (e) => {
        e.preventDefault();
        setBotaoDisabled(true);
        const request = {
            codigoContaDestino: responseConsulta.Codigo,
            emv: qrCodeResult,
            valor: formatarValor(responseConsulta.Valor),
            infoAdicional: responseConsulta.InfoAdicional
        }
        await enviarPixViaEMV(request);
        closeModalLerQrCode();
        setBotaoDisabled(false);
    };

    const obterResultScan = (emv) => {
        setQRCodeResult(emv)
    };

    useEffect(() => {
        if (qrCodeResult !== '') {
            avancarEtapa();
        }
    }, [qrCodeResult]);

    return (
        <div className="container-pix">
            <div className="title-pix">
                <h3 className="titulo-h5"> <img src={Icon} alt=""></img> Pix </h3>
            </div>
            <div className="card-pix">
                <div className="titulo-transacao">
                    <h2 style={{ color: '#DB4648' }}>Escolha o tipo desejado:</h2>
                </div>
                <div className="card-pix-buttons">
                    <button type="submit" className="botao-um button-pix" onClick={openModalPixChave}> Pix Por Chave </button>
                    <button type="submit" className="botao-um button-pix" onClick={openModalPixCopiaCola}> Pix Copia e Cola </button>
                    <button type="submit" className="botao-um button-pix" onClick={openModalLerQrCode}> Ler QRCode </button>
                </div>

                <Modal show={modalPixChaveIsOpen} centered >
                    <Modal.Header>
                        <Modal.Title style={{ color: '#DB4648' }}>Pix Por Chave</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container-pix-por-chave">
                            {etapa === 1 && (
                                <>
                                    <div>
                                        <label className="mt-4" style={{ color: "#3f3d56" }}>Chave</label>
                                        <input
                                            type="text"
                                            className="form-control chave-pix"
                                            id="chavePix"
                                            placeholder="CPF, celular, e-mail ou aleatória"
                                            name="nome"
                                            value={chavePix}
                                            onChange={(e) => setChavePix(e.target.value)}
                                        />
                                    </div>
                                    <div className="table-chave-favorita">
                                        <label className="mt-5" style={{ color: "#3f3d56" }}>Chaves Favoritas</label>
                                        {chavesFavoritas.length > 0 && (
                                            <Table hover responsive className="table-favorita-chave table-rounded">
                                                <thead>
                                                    <tr>
                                                        <th className="hidden">Codigo</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {chavesFavoritas.map((record, index) => (
                                                        <tr key={index} >
                                                            <td className="hidden">{record.Codigo}</td>
                                                            <td>
                                                                <div className="tipo-chave">
                                                                    <span><strong>{formatarEnum(record.TipoChave)} - {record.Nome}</strong></span>
                                                                </div>
                                                                <div className="valor-chave">
                                                                    <span>{record.Chave_Pix}</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        )}
                                        {chavesFavoritas.length === 0 && (
                                            <div className="not-found-favoritas mt-2">
                                                <img alt="" src={NotFound}></img>
                                                <label className="mt-3" style={{ color: "#3f3d56", fontSize: "11px" }}>Você ainda não possui chaves favoritas.</label>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {etapa === 2 && (
                                <>
                                    <div className="body-pagar">
                                        <label className="mt-4" style={{ color: "#3f3d56", fontSize: '20px' }}>Valor a pagar</label>
                                        <CurrencyInput className="valor-pix" style={{ fontSize: '5rem' }} value={valor} onValueChange={setValor} />
                                        <label className="mt-4 mb-0" style={{ color: "#3f3d56", fontSize: '13px' }}>Pagar para</label>
                                        <label style={{ color: "#DB4648", fontSize: '15px' }}>{responseConsulta.NomeCompleto}</label>
                                    </div>
                                </>
                            )}

                            {etapa === 3 && (
                                <>
                                    <div className="body-pagar">
                                        <label style={{ color: "#3f3d56", fontSize: '20px' }}>Revisão</label>

                                        <div className="revisao-recebedor mt-4">
                                            <div className="quem-receber">
                                                <label style={{ color: "#3f3d56", fontSize: '17px' }}>Quem vai receber?</label>
                                            </div>
                                            <div className="dados-recebedor">
                                                <div className="dados-space">
                                                    <label style={{ color: "#3f3d56" }}>Nome:</label>
                                                    <label style={{ color: "#3f3d56" }}>{responseConsulta.NomeCompleto}</label>
                                                </div>
                                                <div className="dados-space">
                                                    <label style={{ color: "#3f3d56" }}>CPF:</label>
                                                    <label style={{ color: "#3f3d56" }}>{formatarCPF(responseConsulta.DocumentoFederal)}</label>
                                                </div>
                                                <div className="dados-space">
                                                    <label style={{ color: "#3f3d56" }}>Instituição:</label>
                                                    <label style={{ color: "#3f3d56" }}>Orion Bank S.A.</label>
                                                </div>
                                                <div className="dados-space">
                                                    <label style={{ color: "#3f3d56" }}>Chave Pix:</label>
                                                    <label style={{ color: "#3f3d56" }}>{responseConsulta.Chave_Pix}</label>
                                                </div>
                                            </div>
                                            <div className="mt-3">
                                                <label className="add-mensagem" onClick={() => setInfoIsOn(!infoIsOn)}>Adicionar mensagem</label>
                                                {infoIsOn && (
                                                    <input
                                                        type="text"
                                                        className="form-control infoAdicional"
                                                        id="infoAdicional"
                                                        placeholder="Mensagem"
                                                        name="infoAdicional"
                                                        maxLength={255}
                                                        value={infoAdicional}
                                                        onChange={(e) => setInfoAdicional(e.target.value)}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={closeModalPixChave}>
                            Cancelar
                        </Button>
                        {etapa === 3 && (
                            <Button variant="success" disabled={botaoDisabled} onClick={enviarPixPorChave}>
                                Confirmar
                            </Button>
                        )}
                        {etapa !== 3 && (
                            <Button variant="primary" onClick={avancarEtapa}>
                                Continuar
                            </Button>
                        )}
                        {etapa > 1 && (
                            <Button variant="primary" onClick={retrocederEtapa}>
                                Voltar
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>

                <Modal show={modalPixCopiaColaIsOpen} centered >
                    <Modal.Header>
                        <Modal.Title style={{ color: '#DB4648' }}>Pix Copia e Cola</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container-pix-por-chave">
                            {etapa === 1 && (
                                <>
                                    <div>
                                        <label className="mt-4" style={{ color: "#3f3d56" }}>EMV</label>
                                        <input
                                            type="text"
                                            className="form-control emv"
                                            id="chavePix"
                                            placeholder="Código EMV"
                                            name="nome"
                                            value={EMV}
                                            onChange={(e) => setEMV(e.target.value)}
                                        />
                                        <div className="not-found-favoritas mt-5">
                                            <img alt="" src={EMVImage}></img>
                                            <label className="mt-3" style={{ color: "#3f3d56", fontSize: "13px" }}>O EMV facilita o pagamento de um QRCode.</label>
                                        </div>
                                    </div>
                                </>
                            )}

                            {etapa === 2 && (
                                <>
                                    <div className="body-pagar">
                                        <label style={{ color: "#3f3d56", fontSize: '20px' }}>Revisão</label>

                                        <div className="revisao-recebedor mt-4">
                                            <div className="quem-receber">
                                                <label style={{ color: "#3f3d56", fontSize: '17px' }}>Quem vai receber?</label>
                                            </div>
                                            <div className="dados-recebedor">
                                                <div className="dados-space">
                                                    <label style={{ color: "#3f3d56" }}>Nome:</label>
                                                    <label style={{ color: "#3f3d56" }}>{responseConsulta.NomeCompleto}</label>
                                                </div>
                                                <div className="dados-space">
                                                    <label style={{ color: "#3f3d56" }}>CPF:</label>
                                                    <label style={{ color: "#3f3d56" }}>{formatarCPF(responseConsulta.DocumentoFederal)}</label>
                                                </div>
                                                <div className="dados-space">
                                                    <label style={{ color: "#3f3d56" }}>Instituição:</label>
                                                    <label style={{ color: "#3f3d56" }}>Orion Bank S.A.</label>
                                                </div>
                                                <div className="dados-space">
                                                    <label style={{ color: "#3f3d56" }}>Chave Pix:</label>
                                                    <label style={{ color: "#3f3d56" }}>{responseConsulta.ChavePix}</label>
                                                </div>
                                                <div className="dados-space">
                                                    <label style={{ color: "#3f3d56" }}>Valor a Pagar:</label>
                                                    <label style={{ color: "#3f3d56" }}>R$ {parseFloat(responseConsulta.Valor)}</label>
                                                </div>
                                            </div>
                                            <div className="mt-3">
                                                <label className="add-mensagem" onClick={() => setInfoIsOn(true)}>Info Adicional</label>
                                                <input
                                                    type="text"
                                                    className="form-control infoAdicional"
                                                    id="infoAdicional"
                                                    placeholder="Mensagem"
                                                    name="infoAdicional"
                                                    maxLength={255}
                                                    disabled
                                                    value={responseConsulta.InfoAdicional}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={closeModalPixCopiaCola}>
                            Cancelar
                        </Button>
                        {etapa === 2 && (
                            <Button variant="success" disabled={botaoDisabled} onClick={enviarPixPorEMV}>
                                Confirmar
                            </Button>
                        )}
                        {etapa === 1 && (
                            <Button variant="primary" onClick={avancarEtapa}>
                                Continuar
                            </Button>
                        )}
                        {etapa > 1 && (
                            <Button variant="primary" onClick={retrocederEtapa}>
                                Voltar
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>

                <Modal show={modalLerQrCodeOpen} centered >
                    <Modal.Header>
                        <Modal.Title style={{ color: '#DB4648' }}>Ler QRCode</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container-pix-por-chave">
                            {etapa === 1 && (
                                <>
                                    <div className="ler-qr-code">
                                        <h3 className="mt-4" style={{ color: "#3f3d56" }}>Escaneie um QRCode</h3>
                                        <QRScanner onResult={obterResultScan} />
                                    </div>
                                </>
                            )}

                            {etapa === 2 && (
                                <>
                                    <div className="body-pagar">
                                        <label style={{ color: "#3f3d56", fontSize: '20px' }}>Revisão</label>

                                        <div className="revisao-recebedor mt-4">
                                            <div className="quem-receber">
                                                <label style={{ color: "#3f3d56", fontSize: '17px' }}>Quem vai receber?</label>
                                            </div>
                                            <div className="dados-recebedor">
                                                <div className="dados-space">
                                                    <label style={{ color: "#3f3d56" }}>Nome:</label>
                                                    <label style={{ color: "#3f3d56" }}>{responseConsulta.NomeCompleto}</label>
                                                </div>
                                                <div className="dados-space">
                                                    <label style={{ color: "#3f3d56" }}>CPF:</label>
                                                    <label style={{ color: "#3f3d56" }}>{formatarCPF(responseConsulta.DocumentoFederal)}</label>
                                                </div>
                                                <div className="dados-space">
                                                    <label style={{ color: "#3f3d56" }}>Instituição:</label>
                                                    <label style={{ color: "#3f3d56" }}>Orion Bank S.A.</label>
                                                </div>
                                                <div className="dados-space">
                                                    <label style={{ color: "#3f3d56" }}>Chave Pix:</label>
                                                    <label style={{ color: "#3f3d56" }}>{responseConsulta.ChavePix}</label>
                                                </div>
                                                <div className="dados-space">
                                                    <label style={{ color: "#3f3d56" }}>Valor a Pagar:</label>
                                                    <label style={{ color: "#3f3d56" }}>R$ {parseFloat(responseConsulta.Valor)}</label>
                                                </div>
                                            </div>
                                            <div className="mt-3">
                                                <label className="add-mensagem" onClick={() => setInfoIsOn(!infoIsOn)}>Adicionar mensagem</label>
                                                {infoIsOn && (
                                                    <input
                                                        type="text"
                                                        className="form-control infoAdicional"
                                                        id="infoAdicional"
                                                        placeholder="Mensagem"
                                                        name="infoAdicional"
                                                        maxLength={255}
                                                        value={infoAdicional}
                                                        onChange={(e) => setInfoAdicional(e.target.value)}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={closeModalLerQrCode}>
                            Cancelar
                        </Button>
                        {etapa === 2 && (
                            <Button variant="success" disabled={botaoDisabled} onClick={enviarPixPorQRCode}>
                                Confirmar
                            </Button>
                        )}
                        {etapa > 1 && (
                            <Button variant="primary" onClick={retrocederEtapa}>
                                Voltar
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default Pix;