import React, { useState, useContext, useEffect } from "react";
import { SolicitacoesContaContext } from "../../../../contexts/SolicitacoesContaContext";
import { SituacaoEnum } from '../../../../constants/enums';
import PersonLock from "../../../../assets/img/person-lock.svg";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import "./styles.css"

const SolicitacoesConta = () => {
    const solicitacoesContaContext = useContext(SolicitacoesContaContext);
    const aprovarSolicitacao = solicitacoesContaContext.aprovarSolicitacao;
    const reprovarSolicitacao = solicitacoesContaContext.reprovarSolicitacao;
    const buscarSolicitacoes = solicitacoesContaContext.buscarSolicitacoesConta;
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedMensagemConta, setSelectedMensagemConta] = useState({});
    const [botaoDisabled, setBotaoDisabled] = useState(false);

    useEffect(() => {
        refresh();
    }, []);

    const openModal = (mensagemConta) => {
        setSelectedMensagemConta(mensagemConta);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setSelectedMensagemConta({});
        setModalIsOpen(false);
        setBotaoDisabled(false);
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

    function formatarEnum(situacao) {
        switch (situacao) {
            case SituacaoEnum.ATIVA:
                return 'Ativa';
            case SituacaoEnum.INATIVA:
                return 'Inativa';
            case SituacaoEnum.RECUSADA:
                return 'Recusada';
            case SituacaoEnum.APROVADA:
                return 'Aprovada';
            default:
                return 'Desconhecida';
        }
    }

    const aprovarSolicitacaoConta = async (solicitacao) => {
        setBotaoDisabled(true);
        await aprovarSolicitacao(solicitacao);
        refresh();
        setBotaoDisabled(false);
    };

    const reprovarSolicitacaoConta = async (codigo) => {
        setBotaoDisabled(true);
        await reprovarSolicitacao(codigo);
        refresh();
        setBotaoDisabled(false);
    };

    const refresh = async () => {
        const solicitacoes = await buscarSolicitacoes();
        setSolicitacoes(solicitacoes);
    };

    return (
        <div className="container-solicitar">
            <div className="title-solicitar">
                <h3 className="titulo-h5"> <img alt="" src={PersonLock}></img> Solicitações de Contas</h3>
            </div>

            <div className="card-solicitar">
                <Modal show={modalIsOpen} centered >
                    <Modal.Header>
                        <Modal.Title>Informações da Conta</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Nome Completo: {selectedMensagemConta.NomeCompleto}</p>
                        <p>Documento Federal: {selectedMensagemConta.DocumentoFederal}</p>
                        <p>Email: {selectedMensagemConta.Email}</p>
                        <p>Data Nascimento: {formatarData(selectedMensagemConta.DtNasc)}</p>
                        <p>Telefone Celular: {selectedMensagemConta.TelefoneCelular}</p>
                        <p>CEP: {selectedMensagemConta.CEP}</p>
                        <p>Logradouro: {selectedMensagemConta.Logradouro}</p>
                        <p>Numero Residencial: {selectedMensagemConta.NumeroResidencial}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                            Fechar
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div className="table-solicitar">
                    <Table striped bordered hover responsive="md">
                        <thead>
                            <tr>
                                <th className="hidden">Codigo</th>
                                <th>DtInclusao</th>
                                <th>DtSituacao</th>
                                <th>Situacao</th>
                                <th>Analisar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {solicitacoes.map((record, index) => (
                                <tr key={index}>
                                    <td className="hidden">{record.Codigo}</td>
                                    <td>{formatarData(record.DtInclusao)}</td>
                                    <td>{formatarData(record.DtSituacao)}</td>
                                    <td>{formatarEnum(record.Situacao)}</td>
                                    <td>
                                        <Button variant="secondary" as="input" type="submit" value="Analisar" onClick={() => openModal(record.conta)} />
                                    </td>
                                    <td>
                                        <Button variant="success" disabled={botaoDisabled} as="input" type="submit" value="Aprovar" onClick={() => aprovarSolicitacaoConta(record)} />
                                    </td>
                                    <td>
                                        <Button variant="danger" disabled={botaoDisabled} as="input" type="submit" value="Reprovar" onClick={() => reprovarSolicitacaoConta(record.Codigo)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default SolicitacoesConta;