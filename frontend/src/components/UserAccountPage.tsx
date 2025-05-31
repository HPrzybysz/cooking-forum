import React, {useState, useEffect} from 'react';
import {
    Box,
    Typography,
    Avatar,
    TextField,
    Button,
    Paper,
    InputAdornment,
    CircularProgress,
    Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {getRecipesByUser} from '../services/recipeService';
import {getRecipeImages} from "../services/recipeImageService.ts";
import api from '../api';
import '../styles/UserAccountPage.scss';
import {Recipe, RecipeImage} from './types.ts';

interface UserProfile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
}

const UserAccountPage: React.FC = () => {
    const navigate = useNavigate();
    const {user: authUser, setUser} = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [recipesLoading, setRecipesLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [user, setLocalUser] = useState<UserProfile | null>(null);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const getFullAvatarUrl = (url: unknown): string | undefined => {
        if (!url) return undefined;
        const urlString = String(url);

        if (!urlString.trim() || ['null', 'undefined'].includes(urlString.toLowerCase())) {
            return undefined;
        }

        if (/^https?:\/\//i.test(urlString)) {
            return urlString;
        }
        return `${process.env.VITE_API_URL || 'http://localhost:5000'}${urlString.startsWith('/') ? '' : '/'}${urlString}`;
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (authUser?.id) {
                try {
                    const response = await api.get('/api/users/me');
                    const backendUser = response.data;

                    setLocalUser({
                        id: backendUser.id,
                        firstName: backendUser.first_name,
                        lastName: backendUser.last_name,
                        email: backendUser.email,
                        avatarUrl: backendUser.avatar_url
                    });

                    setFormData({
                        firstName: backendUser.first_name || '',
                        lastName: backendUser.last_name || '',
                        email: backendUser.email || '',
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                    });

                    setRecipesLoading(true);
                    const recipesResponse = await getRecipesByUser();

                    const recipesWithImages = await Promise.all(
                        (recipesResponse as Recipe[]).map(async (recipe) => {
                            try {
                                const images = await getRecipeImages(recipe.id.toString());
                                return {
                                    ...recipe,
                                    images: images || []
                                };
                            } catch (error) {
                                console.error(`Error fetching images for recipe ${recipe.id}:`, error);
                                return {
                                    ...recipe,
                                    images: []
                                };
                            }
                        })
                    );

                    // @ts-ignore
                    setRecipes(recipesWithImages);
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                    setError('Failed to load user data');
                } finally {
                    setRecipesLoading(false);
                }
            }
        };

        if (authUser) {
            fetchUserData();
        }

        return () => {
            recipes.forEach(recipe => {
                recipe.images?.forEach(image => {
                    if (image.image_data && !image.image_url) {
                        URL.revokeObjectURL(getImageUrl(image));
                    }
                });
            });
        };

    }, [authUser]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const formData = new FormData();
            setAvatarFile(file);
            formData.append('avatar', file);

            try {
                setIsLoading(true);
                const response = await api.patch('/api/users/me/avatar', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                const newAvatarUrl = response.data.avatarUrl;

                setLocalUser(prev => prev ? {
                    ...prev,
                    avatarUrl: newAvatarUrl
                } : null);

                setUser(prev => prev ? {
                    ...prev,
                    avatarUrl: newAvatarUrl
                } : null);

                setSuccess('Avatar updated successfully!');
            } catch (error) {
                setError('Failed to update avatar');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSaveProfile = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.patch('/api/users/me', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email
            });

            setLocalUser(response.data);
            setUser(response.data);
            setIsEditing(false);
            setSuccess('Profile updated successfully');
        } catch (error: any) {
            setError(error.response?.data?.error || 'Failed to update profile');
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
        setError(null);

        try {
            // @ts-ignore
            const response = await api.post('/api/auth/change-password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });

            setIsEditingPassword(false);
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
            setSuccess('Password changed successfully');

        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Failed to change password';
            setError(errorMessage);

            // Clear current password field if it was wrong
            if (errorMessage.includes('Current password is incorrect')) {
                setFormData(prev => ({ ...prev, currentPassword: '' }));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (!user) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress/>
            </Box>
        );
    }

    const getImageUrl = (image: RecipeImage | undefined, width: number = 600, height: number = 400): string => {
        if (image?.image_url) {
            return image.image_url.startsWith('http')
                ? image.image_url
                : `${process.env.VITE_API_URL || 'http://localhost:5000'}${image.image_url.startsWith('/') ? '' : '/'}${image.image_url}`;
        }

        if (image?.image_data) {
            try {
                const blob = new Blob([new Uint8Array(image.image_data.data)],
                    {type: image.image_data.type || 'image/jpeg'});
                return URL.createObjectURL(blob);
            } catch (err) {
                console.error('Error creating image URL:', err);
            }
        }

        return `https://placehold.co/${width}x${height}?text=No+Image`;
    };

    const renderRecipesSection = () => {
        return (
            <Box className="recipes-section">
                <Typography variant="h5" gutterBottom className="section-title">
                    My Recipes ({recipes.length})
                </Typography>

                {recipesLoading ? (
                    <Box display="flex" justifyContent="center" py={4}>
                        <CircularProgress/>
                    </Box>
                ) : recipes.length === 0 ? (
                    <Box textAlign="center" py={4}>
                        <Typography variant="body1" color="text.secondary">
                            You haven't created any recipes yet.
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{mt: 2}}
                            onClick={() => navigate('/add-recipe')}
                        >
                            Create Your First Recipe
                        </Button>
                    </Box>
                ) : (
                    <Box className="recipes-grid">
                        {recipes.map((recipe) => {
                            const primaryImage = recipe.images?.find(img => img.is_primary) || recipe.images?.[0];
                            const imageWidth = 250;
                            const imageHeight = 200;

                            return (
                                <Box
                                    key={recipe.id}
                                    className="recipe-card"
                                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                                >
                                    <Box className="recipe-image">
                                        <img
                                            src={getImageUrl(primaryImage, imageWidth, imageHeight)}
                                            alt={recipe.title}
                                            loading="lazy"
                                        />
                                    </Box>
                                    <Typography variant="h6" className="recipe-name">
                                        {recipe.title}
                                    </Typography>
                                    <Box className="recipe-meta">
                                        <Typography variant="caption">
                                            ⏱️ {recipe.prep_time} min
                                        </Typography>
                                        <Typography variant="caption">
                                            🍽️ {recipe.servings} servings
                                        </Typography>
                                        <Typography variant="caption">
                                            {formatDate(recipe.created_at)}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                )}
            </Box>
        );
    };

    return (
        <Box className="user-account-page">
            <Typography variant="h3" component="h1" className="page-title">
                My Account
            </Typography>

            {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
            {success && <Alert severity="success" sx={{mb: 2}}>{success}</Alert>}

            <Paper className="profile-section" elevation={3}>
                <Box className="avatar-container">
                    <Avatar
                        src={getFullAvatarUrl(user?.avatarUrl)}
                        sx={{width: 100, height: 100}}
                        className="user-avatar"
                    >
                        {user?.firstName?.charAt(0)}
                    </Avatar>
                    <input
                        accept="image/*"
                        id="avatar-upload"
                        type="file"
                        style={{display: 'none'}}
                        onChange={handleAvatarChange}
                        disabled={isLoading}
                        key={avatarFile ? 'file-selected' : 'no-file'}
                    />
                    <label htmlFor="avatar-upload">
                        <Button
                            variant="outlined"
                            component="span"
                            startIcon={<EditIcon/>}
                            size="small"
                            sx={{mt: 1}}
                            disabled={isLoading}
                        >
                            Change
                        </Button>
                    </label>
                </Box>

                <Box className="profile-info">
                    {isEditing ? (
                        <>
                            <TextField
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
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
                                {user?.firstName || ''} {user?.lastName || ''}
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

            {renderRecipesSection()}
        </Box>
    );
};

export default UserAccountPage;