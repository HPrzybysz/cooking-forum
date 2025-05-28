// src/pages/RecipePage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Divider, List, ListItem, ListItemText, ListItemIcon, Avatar, Chip, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Recipe } from './types';
import { getRecipe } from '../services/recipeService';
import '../styles/RecipePage.scss';

const RecipePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                if (id) {
                    const data = await getRecipe(id);
                    setRecipe(data);
                }
            } catch (error) {
                console.error('Error fetching recipe:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!recipe) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Typography variant="h5">Recipe not found</Typography>
            </Box>
        );
    }

    return (
        <Box className="recipe-page">
            {/* Title */}
            <Typography variant="h2" component="h1" className="recipe-title">{recipe.title}</Typography>

            {/* Main */}
            <Box className="recipe-content" flexDirection={isMobile ? 'column' : 'row'}>
                <Box className="recipe-left-column">
                    <img
                        src={recipe.imageUrl || 'https://placehold.co/600x400'}
                        alt={recipe.title}
                        className="recipe-image"
                        loading="lazy"
                    />

                    <Divider className="recipe-divider"/>

                    <Box className="prep-time">
                        <AccessTimeIcon/>
                        <Typography variant="body1">
                            {recipe.prepTime} minutes
                        </Typography>
                    </Box>

                    <Typography variant="h5" className="ingredients-title">
                        Ingredients
                    </Typography>

                    <List className="ingredients-list">
                        {recipe.ingredients.map((ingredient, index) => (
                            <ListItem key={index}>
                                <ListItemIcon>
                                    <span className="ingredient-bullet">•</span>
                                </ListItemIcon>
                                <ListItemText primary={ingredient}/>
                            </ListItem>
                        ))}
                    </List>
                </Box>

                {/* Right */}
                <Box className="recipe-right-column">
                    <Typography variant="h5" className="instructions-title">
                        Instructions
                    </Typography>

                    <ol className="instructions-list">
                        {recipe.instructions.map((instruction, index) => (
                            <li key={index}>
                                <Typography variant="body1">
                                    {instruction}
                                </Typography>
                            </li>
                        ))}
                    </ol>
                </Box>
            </Box>
            {/* Footer */}
            <Box className="recipe-footer">
                <Box className="author-info">
                    <Avatar
                        src={recipe.author.avatarUrl}
                        alt={recipe.author.name}
                        className="author-avatar"
                    />
                    <Typography variant="body1" className="author-name">
                        {recipe.author.name}
                    </Typography>
                </Box>

                <Box className="tags-container">
                    {recipe.tags.map((tag, index) => (
                        <Chip
                            key={index}
                            label={`#${tag}`}
                            className="tag-chip"
                            variant="outlined"
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default RecipePage;