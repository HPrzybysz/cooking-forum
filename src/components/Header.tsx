import React from 'react';
import '../styles/components.scss';
import logo from '../assets/logo.png';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="container header__container">
                <div className="header__logo">
                    <img src={logo} alt="Cooking Forum Logo" />
                </div>
                <nav className="header__nav">
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Categories</a></li>
                        <li><a id="a3" href="#">Log in / Sign Up</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;