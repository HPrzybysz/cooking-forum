import React, {useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {CssBaseline, ThemeProvider, createTheme, CircularProgress} from '@mui/material';
import Header from './components/Header';
import RecipePage from './components/RecipePage';
import './App.scss';
import LoginPage from './components/LoginPage';
import CategoriesPage from './components/CategoriesPage';
import AddRecipePage from './components/AddRecipePage';
import UserAccountPage from './components/UserAccountPage';
import FavoritesPage from './components/FavoritesPage';
import HomePage from './components/HomePage';
import {AuthProvider, useAuth} from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const theme = createTheme({
    palette: {
        primary: {
            main: '#F59E0B',
        },
        background: {
            default: '#FFFFFF',
            paper: '#FFFFFF',
        },
    },
});

const App: React.FC = () => {
    const [showLoginPage, setShowLoginPage] = useState(false);
    const {user, loading} = useAuth()

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <CircularProgress size={60}/>
            </div>
        );
    }


    return (
        <Router>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <AuthProvider>
                    <div className="app">
                        <Header onLoginClick={() => setShowLoginPage(true)}/>

                        {showLoginPage && (
                            <LoginPage onClose={() => setShowLoginPage(false)}/>
                        )}

                        <Routes>
                            <Route path="/" element={<HomePage/>}/>
                            <Route path="/categories" element={<CategoriesPage/>}/>
                            <Route path="/recipe/:id" element={<RecipePage/>}/>

                            {/* Protected routes */}
                            <Route element={<ProtectedRoute/>}>
                                <Route path="/add-recipe" element={<AddRecipePage/>}/>
                                <Route path="/account" element={<UserAccountPage/>}/>
                                <Route path="/favorites" element={<FavoritesPage/>}/>
                            </Route>
                        </Routes>
                    </div>
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
};

export default App;