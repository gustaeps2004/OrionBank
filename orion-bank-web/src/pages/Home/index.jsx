import React, { useState, useContext, useEffect } from "react";
import { ContaContext } from "../../contexts/ContaContext";
import { MovimentoContext } from "../../contexts/MovimentoContext";
import { TipoTransacaoEnum } from '../../constants/enums';
import btnPix from "../../assets/img/logoPix.svg"
import btnExtrato from "../../assets/img/logoExtrato.svg"
import btnTransf from "../../assets/img/logoTransf.svg"
import btnConta from "../../assets/img/logoConta.svg"
import imgCard from "../../assets/img/cartao2img.svg"
import EyeOpen from "../../assets/img/EyeOpen.svg";
import EyeClose from "../../assets/img/EyeClose.svg";
import { Link } from "react-router-dom";
import "./styles.css"

const Home = () => {
    const { buscarSaldo, buscarNome } = useContext(ContaContext);
    const { obterMovimentacao, user } = useContext(MovimentoContext);
    const [hideEye, setHideEye] = useState(true);
    const [saldo, setSaldo] = useState(0.00);
    const [nome, setNome] = useState("");
    const [elementoVisivel, setElementoVisivel] = useState(true);
    const [movimentos, setMovimentos] = useState([]);
    const [notificacoes, setNotificacoes] = useState(false);

    const hideMoney = () => {
        setHideEye(!hideEye);
        setElementoVisivel(!elementoVisivel);
    }

    const refresh = async () => {
        const movimentos = await obterMovimentacao();
        setMovimentos(movimentos);
    };

    function formatarData(data) {
        const dataObj = new Date(data);
        const dia = String(dataObj.getDate()).padStart(2, '0');
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
        const ano = dataObj.getFullYear().toString().slice(-2);
        let hora = dataObj.getHours();
        let minuto = dataObj.getMinutes();
        minuto = parseInt(minuto) < 10 ? `0${parseInt(minuto)}` : minuto;
        hora = parseInt(hora) < 10 ? `0${parseInt(hora)}` : hora;
        return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
    }

    function formatarEnum(situacao) {
        switch (situacao) {
            case TipoTransacaoEnum.PIX:
                return 'Pix';
            case TipoTransacaoEnum.TED:
                return 'Ted';
            case TipoTransacaoEnum.QrCode:
                return 'QrCode';
            case TipoTransacaoEnum.Transferencia:
                return 'Transferência';
            default:
                return 'Desconhecida';
        }
    }

    function formatarDinDin(valor) {
        const dindinFormatado = parseFloat(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        return dindinFormatado;
    }

    useEffect(() => {
        const fetchSaldo = async () => {
            const saldo = await buscarSaldo();
            const saldoFormatado = parseFloat(saldo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            setSaldo(saldoFormatado);
        };

        const fetchNome = async () => {
            const nome = await buscarNome();
            setNome(nome);
        };

        refresh();
        fetchSaldo();
        fetchNome();
    }, []);

    useEffect(() => {
        if (!notificacoes) {
            const localNotificado = localStorage.getItem("notificado");
            setNotificacoes(localNotificado);
        }
    });

    return (
        <div className="content-wrapper home-page">

            <div className="row">
                <div className="col-md-12 mb-4">
                    <div className="row">
                        <div className="col-12 col-x1-8 mb-4 mb-x1-0">
                            <h3>Bem-vindo, {nome}!</h3>
                            {!notificacoes && (
                                <h6 className="mb-0"> <span style={{ color: '#EB4E50' }}>1</span> notificação não lida!</h6>
                            )}

                            {notificacoes && (
                                <h6 className="mb-0"> <span style={{ color: '#EB4E50' }}>0</span> notificações recebidas!</h6>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            <div className="rowTeste">
                <div className="row2">
                    <div className="mb-3 teste">
                        <div className="card card-tale">
                            <div className="card-body1">
                                <p className="fs-20 mb-1">Saldo atual</p>
                                <div className="saldo">
                                    {elementoVisivel && <p className="fs-23 mb-0">{saldo}</p>}
                                    {!elementoVisivel && <p className="fs-23 mb-0"> R$ *****</p>}
                                </div>
                            </div>

                            <div>
                                <Link onClick={hideMoney} style={{ cursor: 'pointer' }}>
                                    <i className="teste">
                                        {hideEye && (
                                            <img src={EyeOpen} alt="" />
                                        )}

                                        {!hideEye && (
                                            <img src={EyeClose} alt="" />
                                        )}
                                    </i>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="row-cards">
                        <div className="spaceb">
                            <Link to="/pix" title="Pix">
                                <div className="card card-light-danger">
                                    <div className="btn-body">
                                        <img src={btnPix} alt=""></img>
                                    </div>
                                </div>
                            </Link>
                            <Link to="/extratoConta" title="Extrato">
                                <div className="card card-light-danger">
                                    <div className="btn-body">
                                        <img src={btnExtrato} alt=""></img>
                                    </div>
                                </div>
                            </Link>
                            <Link to="/transferir" title="Transferência">
                                <div className="card card-light-danger">
                                    <div className="btn-body">
                                        <img src={btnTransf} alt=""></img>
                                    </div>
                                </div>
                            </Link>
                            <Link to="/dados" title="Conta">
                                <div className="card card-light-danger">
                                    <div className="btn-body">
                                        <img src={btnConta} alt=""></img>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="row3">
                    <div className="tabelita">
                        <div className="card-body">
                            <p className="card-title mb-0 titulo-tabela">Ultimas movimentações</p>
                            <div className="table-responsive">
                                <table className="table table-borderless">
                                    <thead>
                                        <tr>
                                            <th className="pl-0  pb-2 border-bottom">Tipo</th>
                                            <th className="border-bottom pb-2">Valor</th>
                                            <th className="border-bottom pb-2">Data/Hora</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {movimentos.map((record, index) => (
                                            <tr key={index}>

                                                <td>{formatarEnum(record.TipoTransacao)}</td>
                                                <td>{record.CodigoContaOrigem === user.codigo ?
                                                    <span style={{ "color": "red" }}>-{formatarDinDin(record.Valor)}</span> :
                                                    <span style={{ "color": "green" }}>+{formatarDinDin(record.Valor)}</span>}
                                                </td>
                                                <td>{formatarData(record.DtMovimento)}</td>

                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="cartao">
                        <div className="card-cartao">
                            <div className="mb-3 fs-20">
                                <div className="texto-card">Solicite um cartão de crédito</div>
                                <img src={imgCard} alt="imagem de um cartão" className="cartao-img" />

                            </div>

                            <div className="middle">
                                <div className="">
                                    <Link to="#"> <button type="submit" className="btn-solicita">Solicitar</button> </Link>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;