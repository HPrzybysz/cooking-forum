import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import LoginPage from './LoginPage';
import SignUpPage from './SignupPage';

const AuthModal: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isLoginPage = location.pathname === '/login';
    const isSignupPage = location.pathname === '/signup';

    if (!isLoginPage && !isSignupPage) return null;

    const handleClose = () => {
        navigate('/');
    };

    const handleLoginSuccess = () => {
        navigate('/');
    };

    const handleSignupSuccess = () => {
        navigate('/');
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {isLoginPage ? (
                <LoginPage
                    onClose={handleClose}
                    onLoginSuccess={handleLoginSuccess}
                    onSignupSuccess={handleSignupSuccess}
                />
            ) : (
                <SignUpPage
                    onClose={handleClose}
                    switchToLogin={() => navigate('/login')}
                    onSignupSuccess={handleSignupSuccess}
                />
            )}
        </div>
    );
};

export default AuthModal;