import React from 'react';
import '../styles/Header.scss';
import logo from '../assets/logo.png';
import {Button} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import AddIcon from '@mui/icons-material/Add';
import {useNavigate} from 'react-router-dom';

interface HeaderProps {
    onLoginClick: () => void;
    isLoggedIn: boolean; //login status
}

const Header: React.FC<HeaderProps> = ({onLoginClick, isLoggedIn}) => {
    const navigate = useNavigate();

    const handleAddRecipeClick = () => {
        if (isLoggedIn) {
            navigate('/add-recipe');
        } else {
            onLoginClick();
        }
    };

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
                                variant="contained"
                                color="primary"
                                size="medium"
                                startIcon={<AddIcon/>}
                                onClick={handleAddRecipeClick}
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    backgroundColor: '#F59E0B',
                                    '&:hover': {
                                        backgroundColor: '#D48A08'
                                    }
                                }}
                            >
                                Add Recipe
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
                                {isLoggedIn ? 'Logout' : 'Login / Sign Up'}
                            </Button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;