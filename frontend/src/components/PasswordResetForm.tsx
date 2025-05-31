import React, {useState} from 'react';
import {Box, TextField, Button, Typography, Paper, CircularProgress, Alert} from '@mui/material';
import api from '../api';
import {useNavigate, useParams} from 'react-router-dom';

const PasswordResetForm: React.FC = () => {
    const {token} = useParams<{ token: string }>();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await api.post('/api/auth/reset-password', {
                token,
                newPassword
            });

            setSuccess('Password reset successfully! You will be redirected shortly.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box sx={{maxWidth: 400, mx: 'auto', mt: 4}}>
            <Paper elevation={3} sx={{p: 3}}>
                <Typography variant="h5" gutterBottom>
                    Set New Password
                </Typography>

                {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
                {success && <Alert severity="success" sx={{mb: 2}}>{success}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Confirm New Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        margin="normal"
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{mt: 2}}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24}/> : 'Reset Password'}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default PasswordResetForm;