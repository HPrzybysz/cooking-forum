import React, {useState, useEffect} from 'react';
import {Box, Typography, Paper, Grid, CircularProgress} from '@mui/material';
import {useAuth} from '../context/AuthContext';
import {useNavigate} from "react-router-dom";
import api from '../api';
import RecipeCard from '../components/RecipeCard';
import {Recipe} from './types';
import '../styles/FavoritesPage.scss';

const FavoritesPage: React.FC = () => {
    const {user} = useAuth();
    const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const response = await api.get('/api/user/favorites');
                setFavoriteRecipes(response.data);
            } catch (error) {
                console.error('Error fetching favorites:', error);
                setError('Failed to load favorites. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [user]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress/>
            </Box>
        );
    }

    if (error) {
        return (
            <Paper elevation={3} sx={{p: 3, textAlign: 'center', my: 4}}>
                <Typography variant="h5" color="error">{error}</Typography>
            </Paper>
        );
    }

    if (!user) {
        return (
            <Paper elevation={3} sx={{p: 3, textAlign: 'center', my: 4}}>
                <Typography variant="h5">Please log in to view your favorites</Typography>
            </Paper>
        );
    }


    return (
        <Box className="favorites-page">
            <Typography variant="h4" gutterBottom>
                My Favorite Recipes
            </Typography>

            {favoriteRecipes.length === 0 ? (
                <Paper elevation={3} sx={{p: 3, textAlign: 'center'}}>
                    <Typography variant="body1">You don't have any favorite recipes yet.</Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {favoriteRecipes.map((recipe) => (
                        // @ts-ignore
                        <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                            <RecipeCard
                                key={recipe.id}
                                recipeId={recipe.id}
                                title={recipe.title}
                                statistics={recipe.statistics}
                                onClick={() => navigate(`/recipe/${recipe.id}`)}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default FavoritesPage;