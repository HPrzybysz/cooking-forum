import React from 'react';
import '../styles/Header.scss';
import logo from '../assets/logo.png';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { InputLabel, Box, MenuItem, Button } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

interface HeaderProps {
    onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
    const [category, setCategory] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value as string);
    };

    return (
        <header className="header">
            <div className="container header__container">
                <div className="header__logo">
                    <img src={logo} alt="Cooking Forum Logo" />
                </div>
                <nav className="header__nav">
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="category-label">Categories</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        id="category-select"
                                        value={category}
                                        label="Categories"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={"breakfast"}>Breakfast</MenuItem>
                                        <MenuItem value={"dinner"}>Dinner</MenuItem>
                                        <MenuItem value={"desserts"}>Deserts</MenuItem>
                                        <MenuItem value={"snacks"}>Snacks</MenuItem>
                                        <MenuItem value={"salads"}>Salads</MenuItem>
                                        <MenuItem value={"oven"}>Oven</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </a></li>
                        <li>
                            <Button
                                className={'login-button'}
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