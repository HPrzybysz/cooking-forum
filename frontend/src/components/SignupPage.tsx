import React, {useState, useEffect} from 'react';
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
    Fade,
    CircularProgress,
    Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import '../styles/LoginPage.scss';
import {useAuth} from '../context/AuthContext';

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

interface SignUpPageProps {
    onClose: () => void;
    switchToLogin: () => void;
    onSignupSuccess?: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({onClose, switchToLogin, onSignupSuccess}) => {
    const [formData, setFormData] = useState<SignUpForm>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });
    const [errors, setErrors] = useState<Partial<SignUpForm>>({});
    const {register, isLoading} = useAuth();
    const [submitError, setSubmitError] = useState<string | null>(null);
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

    const validateForm = (): boolean => {
        const newErrors: Partial<SignUpForm> = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.acceptTerms) {
            newErrors.acceptTerms = true;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'acceptTerms' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name as keyof SignUpForm]) {
            setErrors(prev => ({...prev, [name]: undefined}));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        if (!validateForm()) return;

        try {
            await register(
                formData.firstName,
                formData.lastName,
                formData.email,
                formData.password
            );
            onSignupSuccess?.();
            onClose();
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : 'Signup failed. Please try again.'
            );
        }
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
        }}/>
    );

    return (
        <>
            <BlackBackgroundLayer/>
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
                            Create Account
                        </Typography>
                        <Typography className="form-subtitle">
                            Join our cooking community
                        </Typography>

                        {submitError && (
                            <Alert severity="error" sx={{mb: 2}}>
                                {submitError}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Box sx={{display: 'flex', gap: 2}}>
                                <TextField
                                    className="form-field"
                                    fullWidth
                                    label="First Name"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    required
                                    error={!!errors.firstName}
                                    helperText={errors.firstName}
                                    disabled={isLoading}
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
                                    error={!!errors.lastName}
                                    helperText={errors.lastName}
                                    disabled={isLoading}
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
                                error={!!errors.email}
                                helperText={errors.email}
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
                                error={!!errors.password}
                                helperText={errors.password}
                                disabled={isLoading}
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
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                                disabled={isLoading}
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="acceptTerms"
                                        checked={formData.acceptTerms}
                                        onChange={handleInputChange}
                                        required
                                        color="primary"
                                        disabled={isLoading}
                                    />
                                }
                                label={
                                    <Typography variant="body2" color={errors.acceptTerms ? 'error' : 'inherit'}>
                                        I agree to the Terms of Service
                                    </Typography>
                                }
                                sx={{mt: 1}}
                            />

                            <Button
                                className="submit-button"
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={isLoading}
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
                                    'Sign Up'
                                )}
                            </Button>

                            <Typography className="form-switch-text">
                                Already have an account?{' '}
                                <Link
                                    className="switch-link"
                                    onClick={switchToLogin}
                                    sx={{cursor: 'pointer'}}
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