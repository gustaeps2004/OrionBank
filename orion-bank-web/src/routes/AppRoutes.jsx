import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Login from '../pages/Login';
import Home from '../pages/Home';
import Layout from '../pages/Layout';
import SolicitarConta from '../pages/SolicitarConta';
import SucessoSolicitacao from '../pages/SolicitarConta/SucessoSolicitacao';
import RecuperarSenha from '../pages/RecuperarSenha';
import SucessoRecuperarSenha from '../pages/RecuperarSenha/SucessoRecuperar';
import TermosPolitica from '../pages/TermosPolitica';
import ExtratoConta from '../pages/SideBar/ExtratoConta';
import Dados from '../pages/SideBar/Conta/Dados';

import SolicitacoesConta from '../pages/SideBar/Admin/SolicitacoesConta';
import CadastrarChave from '../pages/SideBar/AreaPix/CadastrarChave';
import Pix from '../pages/SideBar/AreaPix/Pix';
import QRCode from '../pages/SideBar/AreaPix/QRCode';
import Transferir from '../pages/SideBar/Transferencias/Transferir';

import { AuthContext } from "../contexts/AuthContext";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";

const AppRoutes = () => {

    const Private = ({ children }) => {
        const { authenticated, loading } = useContext(AuthContext);

        if (loading) {
            return <div className="loading"> Carregando...</div>
        }

        if (!authenticated) {
            return <Navigate to="/login" />
        }

        return children;
    }

    return (
        <Routes>
            <Route path="*" element={<ErrorBoundary pathError={true} />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/solicitarconta" element={<SolicitarConta />} />
            <Route exact path="/sucessoSolicitacao/:nome" element={<SucessoSolicitacao />} />
            <Route exact path="/recuperar" element={<RecuperarSenha />} />
            <Route exact path="/sucessoRecuperar/:tipoSucesso" element={<SucessoRecuperarSenha />} />
            <Route exact path="/termosPoliticas" element={<TermosPolitica />} />
            <Route path="/" element={<Layout />}>
                <Route exact index element={<Private><Home /></Private>} />
                <Route exact path="solicitacoesConta" element={<Private><SolicitacoesConta /></Private>} />
                <Route exact path="cadastrarChave" element={<Private><CadastrarChave /></Private>} />
                <Route exact path="extratoConta" element={<Private><ExtratoConta /></Private>} />
                <Route exact path="pix" element={<Private><Pix /></Private>} />
                <Route exact path="criarQRCode" element={<Private><QRCode /></Private>} />
                <Route exact path="transferir" element={<Private><Transferir /></Private>} />
                <Route exact path="dados" element={<Private><Dados /></Private>} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;