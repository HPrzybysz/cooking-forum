import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';

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
                            onClose={() => {}}
                            onLoginSuccess={() => {}}
                        />
                    } />
                    <Route path="/signup" element={
                        <SignUpPage
                            onClose={() => {}}
                            switchToLogin={() => {}}
                            onSignupSuccess={() => {}}
                        />
                    } />
                    <Route path="/" element={
                        <ProtectedRoute isPublic>
                            <HomePage />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;