import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Box, Typography, Button, CircularProgress, Grid} from '@mui/material';
import RecipeCard from './RecipeCard';
import {getRecipesByCategory} from '../services/categoryService';
import {Recipe} from './types';

const CategoryRecipesPage: React.FC = () => {
    const {categoryId} = useParams<{ categoryId: string }>();
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const data = await getRecipesByCategory(categoryId!);
                setRecipes(data.recipes);
                setCategoryName(data.categoryName);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchRecipes();
        }
    }, [categoryId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <Box sx={{padding: 3}}>
            <Button
                variant="contained"
                onClick={() => navigate('/categories')}
                sx={{
                    backgroundColor: '#F59E0B',
                    color: 'white',
                    marginBottom: '2rem',
                    '&:hover': {
                        backgroundColor: '#D48A08'
                    }
                }}
            >
                Back to Categories
            </Button>

            <Typography variant="h3" gutterBottom>
                Recipes in {categoryName} category
            </Typography>

            {recipes.length === 0 ? (
                <Typography variant="body1">No recipes found in this category.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {recipes.map(recipe => (
                        <RecipeCard
                            key={recipe.id}
                            recipeId={recipe.id}
                            title={recipe.title}
                            statistics={recipe.statistics}
                            onClick={() => navigate(`/recipe/${recipe.id}`)}
                        />
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default CategoryRecipesPage;