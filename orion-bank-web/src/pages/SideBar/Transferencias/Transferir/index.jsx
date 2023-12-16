import React, { useState, useContext } from "react";
import { showErrorNotification } from '../../../../shared/notificationUtils';
import { MovimentoContext } from "../../../../contexts/MovimentoContext";
import InputMask from 'react-input-mask';
import Icon from "../../../../assets/img/transf-icon.svg";
import CurrencyInput from "../../../../components/MoneyInput";
import Background from "../../../../assets/img/undraw-transf.svg";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "./styles.css"

const Transferir = () => {
    const [modalTransfIsOpen, setOpenModalTransf] = useState(true);
    const { enviarTransferencia } = useContext(MovimentoContext);
    const [etapa, setEtapa] = useState(1);
    const [valor, setValor] = useState('R$ 0,00');
    const [dadosBancarios, setDadosBancarios] = useState({ agencia: '', conta: '', contaDigito: '' });
    const [infoIsOn, setInfoIsOn] = useState(false);
    const [infoAdicional, setInfoAdicional] = useState('');
    const [botaoDisabled, setBotaoDisabled] = useState(false);

    const openModalTransf = () => {
        setOpenModalTransf(true);
    };

    const closeModalTransf = () => {
        setOpenModalTransf(false);
        setDadosBancarios({ agencia: '', conta: '', contaDigito: '' })
        setInfoIsOn(false);
        setInfoAdicional('');
        setValor('R$ 0,00');
        setEtapa(1);
        setBotaoDisabled(false);
    };

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
        if (dadosBancarios.agencia === '') {
            showErrorNotification("Informe a agência.");
            return false;
        }

        if (dadosBancarios.conta === '') {
            showErrorNotification("Informe a conta.");
            return false;
        }

        if (dadosBancarios.contaDigito === '') {
            showErrorNotification("Informe a conta digito.");
            return false;
        }

        if (dadosBancarios.agencia.replace('_', '').length !== 4) {
            showErrorNotification("Informe uma agência válida.");
            return false;
        }

        if (dadosBancarios.conta.replace('_', '').length !== 8) {
            showErrorNotification("Informe uma conta válida.");
            return false;
        }

        if (formatarValor(valor) === 0) {
            showErrorNotification("Informe o valor a pagar.");
            return false;
        }


        return true;
    };

    const formatarValor = (value) => {
        if (value === "")
            return 0;

        const formattedValue = parseFloat(value.replace('R$ ', '').replace('.', '').replace(',', '.'));
        return formattedValue;
    };

    const realizarTransferencia = async (e) => {
        e.preventDefault();
        setBotaoDisabled(true);
        const request = {
            codigoContaOrigem: '',
            valor: formatarValor(valor),
            agencia: dadosBancarios.agencia,
            conta: dadosBancarios.conta,
            contaDigito: dadosBancarios.contaDigito,
            descricao: infoAdicional
        }
        const result = await enviarTransferencia(request);
        setBotaoDisabled(false);

        if (result)
            closeModalTransf();
    };

    return (
        <div className="container-trasnf">
            <div className="title-trasnf">
                <h3 className="titulo-h5"> <img src={Icon} alt=""></img> Transferência </h3>
            </div>
            <div className="card-trasnf">
                <div>

                    <div className="background-transf mt-3">
                        <img alt="" src={Background}></img>
                        <h5 className="info-titulo mt-3" style={{ color: "#3f3d56" }}>Realize agora uma transferência bancária.</h5>
                    </div>
                    <div className="mt-5">
                        <button onClick={openModalTransf} id="button-cadastrar" type="submit" className="botao-um button-transf">Transferência interna</button>
                    </div>
                </div>
            </div>

            <Modal show={modalTransfIsOpen} centered >
                <Modal.Header>
                    <Modal.Title style={{ color: '#DB4648' }}>Transferir</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-pix-por-chave">
                        {etapa === 1 && (
                            <>
                                <div className="titulo-modal-transf">
                                    <label className="mb-3" style={{ color: "#3f3d56" }}>Preencha as informações bancárias.</label>
                                </div>
                                <div className="transf-modal">
                                    <div className="linha-um-transf">
                                        <label style={{ color: "#3f3d56" }}>Agência</label>
                                        <InputMask
                                            mask="9999"
                                            type="text"
                                            className="form-control agencia"
                                            id="agencia"
                                            name="agencia"
                                            value={dadosBancarios.agencia}
                                            onChange={(e) => setDadosBancarios({ ...dadosBancarios, agencia: e.target.value })}
                                        />
                                        <label className="mt-3" style={{ color: "#3f3d56" }}>Conta</label>
                                        <InputMask
                                            mask="99999999"
                                            type="text"
                                            className="form-control conta"
                                            id="conta"
                                            name="conta"
                                            value={dadosBancarios.conta}
                                            onChange={(e) => setDadosBancarios({ ...dadosBancarios, conta: e.target.value })}
                                        />
                                        <label className="mt-3" style={{ color: "#3f3d56" }}>Conta Digito</label>
                                        <InputMask
                                            mask="9"
                                            type="text"
                                            className="form-control conta"
                                            id="conta"
                                            name="conta"
                                            value={dadosBancarios.contaDigito}
                                            onChange={(e) => setDadosBancarios({ ...dadosBancarios, contaDigito: e.target.value })}
                                        />
                                    </div>

                                    <label className="mt-4" style={{ color: "#3f3d56" }}>Valor a pagar</label>
                                    <CurrencyInput className="valor-transf" value={valor} onValueChange={setValor} />
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
                                                <label style={{ color: "#3f3d56" }}>Agência Destino:</label>
                                                <label style={{ color: "#3f3d56" }}>{dadosBancarios.conta}</label>
                                            </div>
                                            <div className="dados-space">
                                                <label style={{ color: "#3f3d56" }}>Conta Destino:</label>
                                                <label style={{ color: "#3f3d56" }}>{dadosBancarios.conta}-{dadosBancarios.contaDigito}</label>
                                            </div>
                                            <div className="dados-space">
                                                <label style={{ color: "#3f3d56" }}>Valor:</label>
                                                <label style={{ color: "#3f3d56" }}> {valor}</label>
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
                    <Button variant="danger" onClick={closeModalTransf}>
                        Cancelar
                    </Button>
                    {etapa === 2 && (
                        <Button variant="success" disabled={botaoDisabled} onClick={realizarTransferencia}>
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
        </div>
    );
};

export default Transferir;