import React, { useState, useContext } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Sino from "../Notificacao/Sino";
import TituloMenor from "../../assets/img/titulo-menor-2.svg";
import LogoBank from "../../assets/img/logo-melhor.svg";
import Logout from "../../assets/img/logout.svg";
import '@popperjs/core';
import './styles.css';

const NavBar = ({ toggleSidebar }) => {
    const [logoVisible, setLogoVisible] = useState(true);
    const [buttonClicked, setButtonClicked] = useState(false);
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
    }

    const handleToggleLogo = () => {
        setLogoVisible(!logoVisible);
        setButtonClicked(!buttonClicked);
    };

    return (
        <nav className="navbar navbar-expand-lg custom-navbar">
            {!logoVisible && (
                <div className="navbar-logo">
                    <div className="logo-bank-header">
                        <Link to="/"><img src={LogoBank} alt=""></img></Link>
                    </div>
                </div>
            )}
            {logoVisible && (
                <div className="navbar-titulo">
                    <div className="logo-header">
                        <Link to="/"><img src={TituloMenor} alt=""></img></Link>
                    </div>
                </div>
            )}

            <div className='botoes-navbar'>
                <button type="button" id="sidebarCollapse" className={`custom-botao ${buttonClicked ? 'move-button' : 'back-button-move'}`} onClick={() => { toggleSidebar(); handleToggleLogo(); }}>
                    <i className="fa fa-bars" />
                </button>

                <ul className="navbar-nav navbar-nav-right buttons-sin-logout">
                    <Sino notificacao={"Bem-vindo!"} message={"Estamos a sua disposição."} count={1} />
                    <li className="nav-item logout-nav">
                        <Link to="/login" onClick={handleLogout}>
                            <i className="menu-icon">
                                <img src={Logout} alt="" />
                            </i>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;