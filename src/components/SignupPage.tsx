import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Link,
    Paper,
    Checkbox,
    FormControlLabel,
    IconButton,
    Fade
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import '../styles/LoginPage.scss';

const backgroundImages = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop',
];

interface SignUpForm {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
}

const SignUpPage: React.FC<{ onClose: () => void, switchToLogin: () => void }> = ({ onClose, switchToLogin }) => {
    const [formData, setFormData] = useState<SignUpForm>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [fade, setFade] = useState(true);

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
        const { name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'acceptTerms' ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Sign Up submitted:', formData);
    };

    const BlackBackgroundLayer = () => (
        <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
            zIndex: 1199
        }} />
    );

    return (
        <>
            <BlackBackgroundLayer />
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
                            />
                        </Box>
                    </Fade>
                </Box>

                {/* Left Side */}
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
                            />
                        </Box>
                    </Fade>
                </Box>

                {/* Right side */}
                <Box className="right-form-side">
                    <Paper className="form-paper">
                        <Box className="close-button-container">
                            <IconButton
                                onClick={onClose}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                    }
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        <Typography className="form-title" component="h1" gutterBottom>
                            Create Account
                        </Typography>
                        <Typography className="form-subtitle">
                            Join our cooking community
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    className="form-field"
                                    fullWidth
                                    label="First Name"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    required
                                />
                                <TextField
                                    className="form-field"
                                    fullWidth
                                    label="Last Name"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    required
                                />
                            </Box>

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
                            />

                            <TextField
                                className="form-field"
                                fullWidth
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="acceptTerms"
                                        checked={formData.acceptTerms}
                                        onChange={handleInputChange}
                                        required
                                        color="primary"
                                    />
                                }
                                label={
                                    <Typography variant="body2">
                                        I agree to the Terms of Service
                                    </Typography>
                                }
                                sx={{ mt: 1 }}
                            />

                            <Button
                                className="submit-button"
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                            >
                                Sign Up
                            </Button>

                            <Typography className="form-switch-text">
                                Already have an account?{' '}
                                <Link
                                    className="switch-link"
                                    onClick={switchToLogin}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    Sign in
                                </Link>
                            </Typography>
                        </form>
                    </Paper>
                </Box>
            </Box>
        </>
    );
};

export default SignUpPage;