import React, {useState, useEffect} from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Link,
    Paper,
    Fade,
    IconButton,
    CircularProgress,
    Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import '../styles/LoginPage.scss';
import SignUpPage from './SignupPage';
import {useAuth} from '../context/AuthContext';

const backgroundImages = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&auto=format&fit=crop'
];

interface LoginPageProps {
    onClose: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({onClose}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showSignUp, setShowSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {login, loading} = useAuth();

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
                setFade(true);
            }, 500);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            onClose();
        } catch (error) {
            setError(error.message || 'Login failed. Please try again.');
        }
    };

    if (showSignUp) {
        return (
            <SignUpPage
                onClose={onClose}
                switchToLogin={() => setShowSignUp(false)}
            />
        );
    }

    return (
        <div className="login-modal-content">
            <IconButton
                className="close-button"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    color: 'white',
                    zIndex: 1200
                }}
            >
                <CloseIcon/>
            </IconButton>

            <Box className="login-page-container">
                {/* Background Slider */}
                <Box className="background-slider">
                    <Fade in={fade} timeout={500}>
                        <Box sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'black'
                        }}>
                            <img
                                src={backgroundImages[currentImageIndex]}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    opacity: fade ? 1 : 0
                                }}
                                alt="Background"
                            />
                        </Box>
                    </Fade>
                </Box>

                {/* Right side */}
                <Box className="right-form-side">
                    <Paper className="form-paper" elevation={6}>
                        <Typography className="form-title" component="h1" gutterBottom>
                            Welcome Back
                        </Typography>
                        <Typography className="form-subtitle">
                            Sign in to your cooking forum account
                        </Typography>

                        {error && (
                            <Alert
                                severity="error"
                                sx={{
                                    mb: 2,
                                    '& .MuiAlert-message': {
                                        width: '100%'
                                    }
                                }}
                            >
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                className="form-field"
                                fullWidth
                                label="Email Address"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                margin="normal"
                                required
                                autoComplete="email"
                                disabled={loading}
                            />
                            <TextField
                                className="form-field"
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                margin="normal"
                                required
                                autoComplete="current-password"
                                disabled={loading}
                            />

                            <Box className="forgot-password-link">
                                <Link href="#" variant="body2" color="primary">
                                    Forgot your password?
                                </Link>
                            </Box>

                            <Button
                                className="submit-button"
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                fullWidth
                                sx={{
                                    height: '48px',
                                    backgroundColor: '#F59E0B',
                                    '&:hover': {
                                        backgroundColor: '#D48A08'
                                    }
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} color="inherit"/>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>

                            <Typography className="form-switch-text">
                                Don't have an account?{' '}
                                <Link
                                    className="switch-link"
                                    onClick={() => setShowSignUp(true)}
                                    sx={{cursor: 'pointer'}}
                                >
                                    Sign up
                                </Link>
                            </Typography>
                        </form>
                    </Paper>
                </Box>
            </Box>
        </div>
    );
};

export default LoginPage;