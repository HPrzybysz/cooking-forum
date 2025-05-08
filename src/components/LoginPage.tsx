import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    TextField,
    Button,
    Typography,
    Link,
    Paper,
    Fade
} from '@mui/material';
import { styled } from '@mui/material/styles';
import '../styles/LoginPage.scss';

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

const StyledBackgroundBox = styled(Box)({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    overflow: 'hidden',
});

const LoginPage: React.FC = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [formData, setFormData] = useState<LoginForm>({
        email: '',
        password: ''
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentImageIndex((prevIndex) =>
                    (prevIndex + 1) % backgroundImages.length
                );
                setFade(true);
            }, 500);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex' }}>
            <StyledBackgroundBox>
                <Fade in={fade} timeout={500}>
                    <Box
                        sx={{
                            backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            transition: 'opacity 0.5s ease-in-out'
                        }}
                    />
                </Fade>
            </StyledBackgroundBox>

            <Container maxWidth={false} sx={{ display: 'flex', flexGrow: 1 }}>
                <Grid container sx={{ minHeight: '100vh' }}>
                    {/* Left side */}
                    <Grid
                        item
                        xs={false}
                        sm={6}
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                bottom: 0,
                                width: '1px',
                                backgroundColor: 'rgba(255,255,255,0.3)'
                            }
                        }}
                    >
                        <Box
                            sx={{
                                backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                width: '100%',
                                height: '100%',
                                opacity: fade ? 1 : 0,
                                transition: 'opacity 0.5s ease-in-out'
                            }}
                        />
                    </Grid>

                    {/* Right side - Login Form */}
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'background.paper'
                        }}
                    >
                        <Paper
                            elevation={6}
                            sx={{
                                p: 4,
                                width: '100%',
                                maxWidth: 400,
                                backgroundColor: 'background.paper'
                            }}
                        >
                            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                                {isLoginForm ? 'Welcome Back' : 'Create Account'}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" mb={4}>
                                {isLoginForm ? 'Sign in to your cooking forum account' : 'Join our cooking community'}
                            </Typography>

                            <form onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    required
                                    autoComplete="email"
                                />
                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    required
                                    autoComplete="current-password"
                                    sx={{ mt: 2 }}
                                />

                                {isLoginForm && (
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                        <Link href="#" variant="body2" color="primary">
                                            Forgot your password?
                                        </Link>
                                    </Box>
                                )}

                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    sx={{ mt: 3, mb: 2, py: 1.5 }}
                                >
                                    {isLoginForm ? 'Sign In' : 'Sign Up'}
                                </Button>

                                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                                    {isLoginForm ? "Don't have an account?" : "Already have an account?"}{' '}
                                    <Link
                                        href="#"
                                        color="primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsLoginForm(!isLoginForm);
                                        }}
                                        sx={{ fontWeight: 500 }}
                                    >
                                        {isLoginForm ? 'Sign up' : 'Sign in'}
                                    </Link>
                                </Typography>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default LoginPage;