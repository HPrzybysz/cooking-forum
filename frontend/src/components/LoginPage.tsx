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
import SignUpPage from "./SignupPage.tsx";
import { useAuth } from '../context/AuthContext';

const backgroundImages = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&auto=format&fit=crop'
];

interface LoginForm {
    email: string;
    password: string;
}

interface LoginPageProps {
    onClose: () => void;
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({onClose, onLoginSuccess}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const [formData, setFormData] = useState<LoginForm>({
        email: '',
        password: ''
    });
    const [showSignUp, setShowSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login, isLoading } = useAuth();

    const BlackBackgroundLayer = () => (
        <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
            zIndex: 1199
        }}/>
    );

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await login(formData.email, formData.password);
            onLoginSuccess();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
        }
    };

    return (
        <>
            <BlackBackgroundLayer/>
            {showSignUp ? (
                <SignUpPage
                    onClose={onClose}
                    switchToLogin={() => setShowSignUp(false)}
                    onSignupSuccess={onLoginSuccess}
                />
            ) : (
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

                    {/* Left Image Side */}
                    <Box className="left-image-side">
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
                            <Box className="close-button-container">
                                <IconButton
                                    onClick={onClose}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                        }
                                    }}
                                >
                                    <CloseIcon/>
                                </IconButton>
                            </Box>

                            <Typography className="form-title" component="h1" gutterBottom>
                                Welcome Back
                            </Typography>
                            <Typography className="form-subtitle">
                                Sign in to your cooking forum account
                            </Typography>

                            {error && (
                                <Alert severity="error" sx={{mb: 2}}>
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
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    required
                                    autoComplete="email"
                                    disabled={isLoading}
                                />
                                <TextField
                                    className="form-field"
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    required
                                    autoComplete="current-password"
                                    disabled={isLoading}
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
                                    disabled={isLoading}
                                    fullWidth
                                    sx={{
                                        height: '48px',
                                        backgroundColor: '#F59E0B',
                                        '&:hover': {
                                            backgroundColor: '#D48A08'
                                        }
                                    }}
                                >
                                    {isLoading ? (
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
            )}
        </>
    );
};

export default LoginPage;