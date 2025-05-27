import React from 'react';
import '../styles/Header.scss';
import logo from '../assets/logo.png';
import { Button, Menu, MenuItem, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddIcon from "@mui/icons-material/Add";
import LoginIcon from '@mui/icons-material/LogIn';
import { useAuth } from '../context/AuthContext';

const Header: React.FC<{ onLoginClick: () => void }> = ({ onLoginClick }) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { user, logout, isLoading } = useAuth();

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleAddRecipeClick = () => {
        if (user) {
            navigate('/add-recipe');
        } else {
            onLoginClick();
        }
    };

    const handleMenuItemClick = (path: string) => {
        navigate(path);
        handleMenuClose();
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <header className="header">
            <div className="container header__container">
                <div className="header__logo">
                    <img src={logo} alt="Cooking Forum Logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
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
                                startIcon={<AddIcon />}
                                onClick={handleAddRecipeClick}
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    backgroundColor: '#F59E0B',
                                    '&:hover': {
                                        backgroundColor: '#D48A08'
                                    }
                                }}
                                disabled={isLoading}
                            >
                                Add Recipe
                            </Button>
                        </li>
                        {user ? (
                            <li>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    size="medium"
                                    startIcon={
                                        <Avatar
                                            src={user.avatarUrl}
                                            sx={{ width: 24, height: 24 }}
                                        >
                                            {user.firstName?.charAt(0)}
                                        </Avatar>
                                    }
                                    onClick={handleMenuOpen}
                                    sx={{
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        '&:hover': {
                                            color: '#F59E0B'
                                        }
                                    }}
                                    disabled={isLoading}
                                >
                                    {user.firstName || 'My Account'}
                                </Button>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem onClick={() => handleMenuItemClick('/account')}>
                                        <AccountCircleIcon sx={{ mr: 1 }} />
                                        My Account
                                    </MenuItem>
                                    <MenuItem onClick={() => handleMenuItemClick('/favorites')}>
                                        <FavoriteIcon sx={{ mr: 1 }} />
                                        My Favorites
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        <ExitToAppIcon sx={{ mr: 1 }} />
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </li>
                        ) : (
                            <li>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    size="medium"
                                    endIcon={<LoginIcon />}
                                    onClick={onLoginClick}
                                    disabled={isLoading}
                                    sx={{
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        '&:hover': {
                                            color: '#F59E0B'
                                        }
                                    }}
                                >
                                    Login / Sign Up
                                </Button>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;