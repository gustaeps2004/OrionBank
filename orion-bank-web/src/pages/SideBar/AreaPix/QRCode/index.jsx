import React, { useState, useContext, useEffect } from "react";
import { QRCodeContext } from "../../../../contexts/QRCodeContext";
import { ChaveContext } from "../../../../contexts/ChaveContext";
import { TipoChavePixEnum } from '../../../../constants/enums';
import { showErrorNotification } from '../../../../shared/notificationUtils';
import CurrencyInput from "../../../../components/MoneyInput";
import QRCodeComponent from "../../../../components/QRCode";
import Icon from "../../../../assets/img/pix-icon.svg";
import NotFound from "../../../../assets/img/undraw_stars.svg";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import "./styles.css"

const QRCode = () => {
    const qrCodeContext = useContext(QRCodeContext);
    const chaveContext = useContext(ChaveContext);
    const criarQRCodeEstatico = qrCodeContext.criarQRCodeEstatico;
    const obterChavesPix = chaveContext.obterChavesPix;
    const [chaves, setChaves] = useState([]);
    const [modalQRCodeIsOpen, setOpenModalQRCode] = useState(false);
    const [modalImagemIsOpen, setOpenModalImagem] = useState(false);
    const [infoIsOn, setInfoIsOn] = useState(false);
    const [chavePix, setChavePix] = useState('');
    const [infoAdicional, setInfoAdicional] = useState('');
    const [valor, setValor] = useState('R$ 0,00');
    const [EMV, setEMV] = useState('');
    const [Imagem, setImagem] = useState('');

    useEffect(() => {
        buscarChaves();
    }, []);

    const criarQRCode = async (e) => {
        e.preventDefault();
        const request = {
            codigoConta: '',
            nomeCompleto: '',
            chavePix: chavePix,
            valor: formatarValor(valor),
            infoAdicional: infoAdicional
        }
        
        if (await validarRequest()) {
            const response = await criarQRCodeEstatico(request);
            if (response !== undefined) {
                setEMV(response.emv);
                setImagem(response.imagem);
                closeModal();
                openModalImagemEMV();
            }
        }
    };

    const validarRequest = async () => {
        if (formatarValor(valor) === 0) {
            showErrorNotification("Informe o valor a pagar.");
            return false;
        }

        return true;
    };

    const buscarChaves = async () => {
        const response = await obterChavesPix();
        if (response !== undefined) {
            setChaves(response);
        }
    }

    const openModal = (chave) => {
        setChavePix(chave);
        setOpenModalQRCode(true);
    };

    const openModalImagemEMV = () => {
        setOpenModalImagem(true);
    };

    const closeModalImagemEMV = () => {
        limparCampos();
        setOpenModalImagem(false);
    };

    const closeModal = () => {
        limparCampos();
        setOpenModalQRCode(false);
    };

    const limparCampos = () => {
        setValor('R$ 0,00');
        setInfoAdicional('');
        setChavePix('');
    }

    const formatarValor = (value) => {
        if (value === "")
            return 0;

        const formattedValue = parseFloat(value.replace('R$ ', '').replace('.', '').replace(',', '.'));
        return formattedValue;
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


    return (
        <div className="container-qrcode">
            <div className="title-qrcode">
                <h3 className="titulo-h5"> <img src={Icon} alt=""></img> Criar QRCode </h3>
            </div>
            <div className="card-qrcode">
                <div>
                    <h2 style={{ color: '#DB4648' }}>Criar QR Code</h2>
                </div>
                <div className="div-descricao">
                    <h5 className="titulo-chaves">Para criar o QRCode selecione a chave pix desejada.</h5>
                </div>
                {chaves.length > 0 && (
                    <div className="table-qr-code">
                        <Table hover responsive className="table-criar-qr">
                            <thead>
                                <tr>
                                    <th className="hidden">Codigo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chaves.map((record, index) => (
                                    <tr key={index} >
                                        <td className="hidden">{record.Codigo}</td>
                                        <td onClick={() => openModal(record.Chave_Pix)}>
                                            <div className="tipo-chave">
                                                <span><strong>{formatarEnum(record.TipoChave)}</strong></span>
                                            </div>
                                            <div className="valor-chave">
                                                <span>{record.Chave_Pix}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
                {chaves.length === 0 && (
                    <div className="background-qr mt-3">
                        <img alt="" src={NotFound}></img>
                        <h5 className="mt-3" style={{ color: "#3f3d56" }}>Você ainda não possui chaves cadastradas.</h5>
                    </div>
                )}
                <Modal show={modalQRCodeIsOpen} centered className="modal-qr-code">
                    <Modal.Header>
                        <Modal.Title style={{ color: '#DB4648' }}>Preencha as informações</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="modal-info-qr-qode">
                            <div className="body-pagar mb-3">
                                <label style={{ color: "#3f3d56", fontSize: '14px' }}>Valor QRCode</label>
                                <CurrencyInput className="valor-qr-code" value={valor} onValueChange={setValor} />
                            </div>

                            <div className="revisao-qrcode mt-4">
                                <div className="dados-recebedor">
                                    <div className="dados-space-qr-code">
                                        <label style={{ color: "#3f3d56", fontSize: '14px' }}>Chave Pix:</label>
                                        <label style={{ color: "#3f3d56", fontSize: '14px' }}>{chavePix}</label>
                                    </div>
                                </div>
                                <div className="adicionar-msg mt-3">
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
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={closeModal}>
                            Cancelar
                        </Button>
                        <Button className="button-criar" type="submit" variant="success" onClick={criarQRCode}>
                            Criar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={modalImagemIsOpen} centered className="modal-qr-code">
                    <Modal.Header>
                        <Modal.Title style={{ color: '#DB4648' }}>QR CODE</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="qrcode-criado">
                            <div className="div-descricao-qrcode">
                                <h5 className="titulo-chaves">Salve o EMV para compartilhar o seu QRCode.</h5>
                            </div>
                            <QRCodeComponent base64Image={Imagem}></QRCodeComponent>
                            <div className="emv-qrcode">
                                <label style={{ color: "#3f3d56" }}>EMV</label>
                                <input
                                    type="text"
                                    className="form-control campo-emv-qr-code"
                                    id="emv"
                                    name="nome"
                                    value={EMV}
                                    disabled
                                />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={closeModalImagemEMV}>
                            Fechar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default QRCode;