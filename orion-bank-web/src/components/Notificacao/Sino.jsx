import React, { useState, useEffect } from 'react';
import Bell from "../../assets/img/sino.svg";
import { Link } from "react-router-dom";
import '@popperjs/core';
import './styles.css';

const Sino = ({ notificacao, message, count }) => {
    const [isNotificado, setIsNotificado] = useState(false);

    const sinoVisualizado = () => {
        setIsNotificado(true);
        localStorage.setItem("notificado", true);
    };

    useEffect(() => {
        const localNotificado = localStorage.getItem("notificado");
        setIsNotificado(localNotificado);
    }, []);

    return (
        <li className="nav-item sino" onClick={sinoVisualizado}>
            <Link className="nav-link count-indicator" id="notificationDropdown" data-toggle="dropdown">
                <i>
                    <img src={Bell} alt="" />
                </i>
                {!isNotificado && (
                    <span className="badge rounded-pill badge-notification bg-danger custom-notfication">{count}</span>
                )}
            </Link>
            <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="notificationDropdown">
                <p className="mb-0 font-weight-normal float-left dropdown-header">Notificações</p>
                <Link className="dropdown-item preview-item">
                    <div className="preview-thumbnail">
                        <div className="preview-icon bg-success">
                            <i className="ti-info-alt mx-0"></i>
                        </div>
                    </div>
                    <div className="preview-item-content">
                        <h6 className="preview-subject font-weight-normal">{notificacao}</h6>
                        <p className="font-weight-light small-text mb-0 text-muted">
                            {message}
                        </p>
                    </div>
                </Link>
            </div>
        </li>
    );
};

export default Sino;