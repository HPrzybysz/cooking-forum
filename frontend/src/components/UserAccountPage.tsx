import React, {useState} from 'react';
import {
    Box,
    Typography,
    Avatar,
    TextField,
    Button,
    Paper,
    InputAdornment,
    CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import {useNavigate} from 'react-router-dom';
import '../styles/UserAccountPage.scss';

interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    recipes: Array<{
        id: string;
        title: string;
        imageUrl: string;
    }>;
}

const UserAccountPage: React.FC = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Mock data
    const [user, setUser] = useState<User>({
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatarUrl: 'https://placehold.co/100',
        recipes: [
            {id: '1', title: 'Pasta Carbonara', imageUrl: 'https://placehold.co/150'},
            {id: '2', title: 'Chicken Curry', imageUrl: 'https://placehold.co/150'},
            {id: '3', title: 'Chocolate Cake', imageUrl: 'https://placehold.co/150'},
        ]
    });

    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setUser(prev => ({...prev, avatarUrl: reader.result as string}));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        setIsLoading(true);
        try {
            //Sim API
            await new Promise(resolve => setTimeout(resolve, 1000));
            setUser(prev => ({
                ...prev,
                name: formData.name,
                email: formData.email
            }));
            setIsEditing(false);
        } catch (err) {
            setError('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            //Sim api
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsEditingPassword(false);
            setFormData(prev => ({...prev, currentPassword: '', newPassword: '', confirmPassword: ''}));
        } catch (err) {
            setError('Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box className="user-account-page">
            <Typography variant="h3" component="h1" className="page-title">
                My Account
            </Typography>

            <Paper className="profile-section" elevation={3}>
                <Box className="avatar-container">
                    <Avatar
                        src={user.avatarUrl}
                        sx={{width: 100, height: 100}}
                        className="user-avatar"
                    >
                        {user.name.charAt(0)}
                    </Avatar>
                    <input
                        accept="image/*"
                        id="avatar-upload"
                        type="file"
                        style={{display: 'none'}}
                        onChange={handleAvatarChange}
                    />
                    <label htmlFor="avatar-upload">
                        <Button
                            variant="outlined"
                            component="span"
                            startIcon={<EditIcon/>}
                            size="small"
                            sx={{mt: 1}}
                        >
                            Change
                        </Button>
                    </label>
                </Box>

                <Box className="profile-info">
                    {isEditing ? (
                        <>
                            <TextField
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Box className="action-buttons">
                                <Button
                                    variant="contained"
                                    onClick={handleSaveProfile}
                                    disabled={isLoading}
                                    startIcon={isLoading ? <CircularProgress size={20}/> : <CheckIcon/>}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => setIsEditing(false)}
                                    disabled={isLoading}
                                    startIcon={<CloseIcon/>}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Typography variant="h5" className="user-name">
                                {user.name}
                            </Typography>
                            <Typography variant="body1" className="user-email">
                                <EmailIcon sx={{verticalAlign: 'middle', mr: 1}}/>
                                {user.email}
                            </Typography>
                            <Button
                                variant="outlined"
                                onClick={() => setIsEditing(true)}
                                startIcon={<EditIcon/>}
                                sx={{mt: 2}}
                            >
                                Edit Profile
                            </Button>
                        </>
                    )}
                </Box>
            </Paper>

            <Paper className="password-section" elevation={3}>
                <Typography variant="h5" className="section-title">
                    <LockIcon sx={{verticalAlign: 'middle', mr: 1}}/>
                    Password
                </Typography>

                {isEditingPassword ? (
                    <>
                        <TextField
                            label="Current Password"
                            name="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="New Password"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Confirm New Password"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        {error && (
                            <Typography color="error" sx={{mt: 1}}>
                                {error}
                            </Typography>
                        )}
                        <Box className="action-buttons">
                            <Button
                                variant="contained"
                                onClick={handleChangePassword}
                                disabled={isLoading}
                                startIcon={isLoading ? <CircularProgress size={20}/> : <CheckIcon/>}
                            >
                                Change Password
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => setIsEditingPassword(false)}
                                disabled={isLoading}
                                startIcon={<CloseIcon/>}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Button
                        variant="outlined"
                        onClick={() => setIsEditingPassword(true)}
                        startIcon={<EditIcon/>}
                    >
                        Change Password
                    </Button>
                )}
            </Paper>

            <Paper className="recipes-section" elevation={3}>
                <Typography variant="h5" className="section-title">
                    My Recipes
                </Typography>
                <Box className="recipes-grid">
                    {user.recipes.map(recipe => (
                        <Box
                            key={recipe.id}
                            className="recipe-card"
                            onClick={() => navigate(`/recipe/${recipe.id}`)}
                        >
                            <img src={recipe.imageUrl} alt={recipe.title}/>
                            <Typography variant="subtitle1">{recipe.title}</Typography>
                        </Box>
                    ))}
                </Box>
            </Paper>
        </Box>
    );
};

export default UserAccountPage;