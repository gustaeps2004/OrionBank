import React from 'react';
import { Link } from "react-router-dom";
import Titulo from "../../assets/img/titulo.svg";
import "./styles.css"

const TermosPolitica = () => {
    return (
        <div className="container">
            <div className="row justify-content-center align-items-center vh-100">
                <div className="col-xl-7 col-lg-12 col-md-9 ">
                    <div className="card o-hidden border-0 shadow-lg my-5">
                        <div className="card-body p-0 ">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="p-5">

                                        <div className="text-center">
                                            <img src={Titulo} className="circulo-preto" alt="" />
                                            <h1 style={{ color: '#DB4648' }} className="h4 mb-0">Termos de Uso</h1>
                                            <h1 style={{ color: '#DB4648' }} className="h4 mb-0">Politicas</h1>
                                        </div>
                                        <div>
                                            <div className="container-texto-termos">
                                                <div className="termos-texto">
                                                    <div>
                                                        <p>
                                                            <strong>1. Introdução</strong><br />
                                                            Bem-vindo ao Orion Bank, um banco digital que oferece uma variedade de serviços financeiros, incluindo PIX, PIX QR Code e transferências bancárias. Ao utilizar nossos serviços, você concorda com os seguintes termos e políticas.
                                                        </p>
                                                        <p>
                                                            <strong>2. Serviços Oferecidos</strong><br />
                                                            <strong>2.1. PIX (Sistema de Pagamentos Instantâneos):</strong> O Orion Bank oferece a opção de realizar transações instantâneas por meio do PIX, permitindo transferências de fundos em tempo real.<br />
                                                            <strong>2.2. PIX QR Code:</strong> Nosso serviço PIX QR Code permite que você receba pagamentos escaneando um código QR gerado pelo Orion Bank.<br />
                                                            <strong>2.3. Transferências Bancárias:</strong> Facilitamos transferências entre contas do Orion Bank, seguindo os procedimentos e regulamentações estabelecidas para cada tipo de transferência.
                                                        </p>

                                                        <p>
                                                            <strong>3. Segurança e Privacidade</strong><br />
                                                            <strong>3.1. Proteção de Dados:</strong> O Orion Bank prioriza a segurança e privacidade dos seus dados. Utilizamos medidas de segurança avançadas para proteger as informações dos nossos clientes.<br />
                                                            <strong>3.2. Confidencialidade:</strong> Respeitamos a confidencialidade das informações dos clientes e não compartilhamos dados pessoais sem o consentimento prévio, a menos que exigido por lei.<br />
                                                        </p>

                                                        <p>
                                                            <strong>4. Responsabilidades do Cliente</strong><br />
                                                            <strong>4.1. Segurança da Conta:</strong> É responsabilidade do cliente manter suas credenciais de acesso (senha, PIN etc.) em segredo para evitar acesso não autorizado à sua conta.<br />
                                                            <strong>4.2. Uso Adequado dos Serviços:</strong> O cliente concorda em utilizar os serviços do Orion Bank de maneira legal e ética, evitando atividades fraudulentas ou ilegais.<br />
                                                        </p>

                                                        <p>
                                                            <strong>5. Disponibilidade dos Serviços</strong><br />
                                                            <strong>5.1. Manutenção Programada:</strong> O Orion Bank pode realizar manutenções programadas nos sistemas. Faremos o possível para minimizar o impacto nos serviços, informando os clientes sobre qualquer interrupção prevista.<br />
                                                        </p>

                                                        <p>
                                                            <strong>6. Alterações nos Termos e Políticas</strong><br />
                                                            <strong>6.1. Atualizações:</strong> O Orion Bank se reserva o direito de fazer alterações nos termos e políticas. Quaisquer mudanças serão comunicadas aos clientes através dos canais oficiais do banco.<br />
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <Link to="/login"><button type="submit" className="botao-um"> OK </button></Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermosPolitica;