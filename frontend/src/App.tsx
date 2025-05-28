import React, {useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import UserAccountPage from "./components/UserAccountPage.tsx";
import CategoriesPage from './components/CategoriesPage';
import CategoryRecipesPage from './components/CategoryRecipesPage';
import RecipePage from './components/RecipePage';
import AddRecipePage from './components/AddRecipePage';

const App: React.FC = () => {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

    return (
        <AuthProvider>
            <Router>
                <Header
                    onLoginClick={() => {
                        setAuthMode('login');
                        setShowAuthModal(true);
                    }}
                />

                {showAuthModal && (
                    authMode === 'login' ? (
                        <LoginPage
                            onClose={() => setShowAuthModal(false)}
                            onLoginSuccess={() => setShowAuthModal(false)}
                        />
                    ) : (
                        <SignUpPage
                            onClose={() => setShowAuthModal(false)}
                            switchToLogin={() => setAuthMode('login')}
                            onSignupSuccess={() => setShowAuthModal(false)}
                        />
                    )
                )}

                <Routes>
                    <Route path="/login" element={
                        <LoginPage
                            onClose={() => {
                            }}
                            onLoginSuccess={() => {
                            }}
                        />
                    }/>
                    <Route path="/signup" element={
                        <SignUpPage
                            onClose={() => {
                            }}
                            switchToLogin={() => {
                            }}
                            onSignupSuccess={() => {
                            }}
                        />
                    }/>
                    <Route path="/account" element={
                        <ProtectedRoute>
                            <UserAccountPage/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/" element={
                        <ProtectedRoute isPublic>
                            <HomePage/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/categories" element={<CategoriesPage/>}/>
                    <Route path="/category/:categoryId" element={<CategoryRecipesPage/>}/>
                    <Route path="/recipe/:id" element={<RecipePage/>}/>
                    <Route path="/add-recipe" element={<ProtectedRoute><AddRecipePage/></ProtectedRoute>}/>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;