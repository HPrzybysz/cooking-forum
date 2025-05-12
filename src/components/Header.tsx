import React from 'react';
import '../styles/Header.scss';
import logo from '../assets/logo.png';
import { Button } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {

    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="container header__container">
                <div className="header__logo">
                    <img src={logo} alt="Cooking Forum Logo"/>
                </div>
                <nav className="header__nav">
                    <ul>
                        <li><Button onClick={() => navigate('/')}>Home</Button></li>
                        <li>
                            <Button
                                onClick={() => navigate('/categories')}
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '1rem'
                                }}
                            >
                                Categories
                            </Button>
                        </li>
                        <li>
                            <Button
                                variant="outlined"
                                color="inherit"
                                size="medium"
                                endIcon={<LoginIcon/>}
                                onClick={onLoginClick}
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    '&:hover': {
                                        color: '#F59E0B'
                                    }
                                }}
                            >
                                Log in / Sign Up
                            </Button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;