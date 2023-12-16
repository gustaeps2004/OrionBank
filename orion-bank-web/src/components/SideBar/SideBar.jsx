import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from "react-router-dom";
import '@popperjs/core';
import './styles.css';
import './bootstrap/style.css';

const SideBar = ({ isOpen, sidebarData }) => {
    const location = useLocation();
    const [activeItem, setActiveItem] = useState(null);
    const sidebarRef = useRef(null);

    const toggleItem = (title) => {
        if (activeItem === title) {
            setActiveItem(null);
        } else {
            setActiveItem(title);
        }
    };

    const handleOutsideClick = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setActiveItem(null);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [isOpen]);

    return (
        <nav id="sidebar" ref={sidebarRef} className={`custom ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <ul className="list-unstyled components custom-ul">
                <div className='top-content'>
                    {sidebarData.map((item, index) => (
                        <li key={index}>
                            <Link
                                to={item.path}
                                className={location.pathname === item.path ? 'active' : ''}
                                onClick={() => toggleItem(item.title)}
                            >
                                <i className="menu-icon">
                                    <img src={item.icon} alt="" />
                                </i>

                                <span className='menu-title'>{item.title}</span>

                                <i className={`menu-arrow ${activeItem === item.title ? 'open' : ''}`}>
                                    <img src={item.arrow} alt="" />
                                </i>
                            </Link>
                            {item.subNav && (
                                <ul className={`sub-nav ${activeItem === item.title ? 'open' : ''}`}>
                                    {item.subNav.map((subItem, subIndex) => (
                                        <li key={subIndex} className={location.pathname === subItem.path ? 'active' : ''}>
                                            <Link
                                                to={subItem.path}
                                                className={location.pathname === subItem.path ? 'active' : ''}
                                            >
                                                {subItem.title}
                                            </Link>
                                            {subItem.subSubNav && (
                                                <ul className={`sub-sub-nav ${activeItem === item.title ? 'open' : ''}`}>
                                                    {subItem.subSubNav.map((subSubItem, subSubIndex) => (
                                                        <li key={subSubIndex}>
                                                            <Link
                                                                to={subSubItem.path}
                                                                className={location.pathname === subSubItem.path ? 'active' : ''}
                                                            >
                                                                {subSubItem.title}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </div>
            </ul>
        </nav>
    );
};

export default SideBar;