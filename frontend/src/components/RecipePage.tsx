import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {
    Box,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Avatar,
    Chip,
    useTheme,
    useMediaQuery,
    CircularProgress,
    ImageList,
    ImageListItem,
    Paper
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import {getRecipe} from '../services/recipeService';
import {getRecipeImages} from '../services/recipeImageService';
import {getRecipeIngredients} from '../services/ingredientService';
import {getRecipeSteps} from '../services/stepService';
import '../styles/RecipePage.scss';

interface Author {
    id: number;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
}

interface Ingredient {
    id: number;
    name: string;
    amount: string;
}

interface Step {
    id: number;
    step_number: number;
    instruction: string;
}

interface RecipeImage {
    id: number;
    recipe_id: number;
    image_url: string | null;
    image_data?: { type: string; data: Uint8Array };
    is_primary: boolean;
    created_at: string;
}

interface Recipe {
    id: number;
    title: string;
    description: string;
    prep_time: number;
    servings: number;
    equipment?: string;
    author_note?: string;
    category?: {
        id: number;
        name: string;
    };
    author: Author;
    ingredients: Ingredient[];
    steps: Step[];
    tags: string[];
    images: RecipeImage[];
    created_at: string;
}

const RecipePage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getImageUrl = (image: RecipeImage): string => {
        if (image.image_url) {
            return image.image_url;
        }

        if (image.image_data) {
            try {
                const blob = new Blob([new Uint8Array(image.image_data.data)],
                    {type: 'image/jpeg'});
                return URL.createObjectURL(blob);
            } catch (err) {
                console.error('Error creating image URL:', err);
            }
        }

        return '';
    };

    useEffect(() => {
        const fetchRecipeData = async () => {
            try {
                if (!id) return;

                setLoading(true);
                setError(null);

                const [recipeData, images, ingredients, steps] = await Promise.all([
                    getRecipe(id),
                    getRecipeImages(id),
                    getRecipeIngredients(id),
                    getRecipeSteps(id)
                ]);

                setRecipe({
                    ...recipeData,
                    images: images || [],
                    ingredients: ingredients || [],
                    steps: steps || [],
                    author: {
                        id: recipeData.user_id,
                        firstName: recipeData.author_first_name,
                        lastName: recipeData.author_last_name,
                        avatarUrl: recipeData.author_avatar
                    },
                    tags: recipeData.tags || [],
                    equipment: recipeData.equipment,
                    created_at: new Date(recipeData.created_at).toISOString()
                });
            } catch (err) {
                console.error('Error fetching recipe:', err);
                setError('Failed to load recipe. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipeData();

        return () => {
            if (recipe?.images) {
                recipe.images.forEach(image => {
                    if (image.image_data && !image.image_url) {
                        URL.revokeObjectURL(getImageUrl(image));
                    }
                });
            }
        };
    }, [id]);

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

    if (!recipe) {
        return (
            <Paper elevation={3} sx={{p: 3, textAlign: 'center', my: 4}}>
                <Typography variant="h5">Recipe not found</Typography>
            </Paper>
        );
    }

    const primaryImage = recipe.images.find(img => img.is_primary) || recipe.images[0];
    const secondaryImages = recipe.images.filter(img => img !== primaryImage);

    return (
        <Box className="recipe-page" sx={{maxWidth: 1200, mx: 'auto', p: {xs: 1, sm: 2, md: 3}}}>
            {/* Title and Description */}
            <Paper elevation={3} sx={{p: 3, mb: 3}}>
                <Typography variant="h2" component="h1" gutterBottom>
                    {recipe.title}
                </Typography>
                <Typography variant="body1" paragraph>
                    {recipe.description}
                </Typography>
            </Paper>

            {/* Images */}
            {recipe.images.length > 0 && (
                <Paper elevation={3} sx={{p: 2, mb: 3}}>
                    <Typography variant="h5" gutterBottom sx={{mb: 2}}>
                        Photos
                    </Typography>
                    <Divider sx={{mb: 2}}/>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                        {primaryImage && (
                            <Box sx={{width: '100%', borderRadius: 1, overflow: 'hidden'}}>
                                <img
                                    src={getImageUrl(primaryImage)}
                                    alt={recipe.title}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        maxHeight: '500px',
                                        objectFit: 'cover'
                                    }}
                                />
                            </Box>
                        )}
                        {secondaryImages.length > 0 && (
                            <ImageList cols={isMobile ? 2 : 4} gap={8}>
                                {secondaryImages.map((image) => (
                                    <ImageListItem key={image.id}>
                                        <img
                                            src={getImageUrl(image)}
                                            alt={`${recipe.title} - ${image.id}`}
                                            style={{
                                                width: '100%',
                                                height: '200px',
                                                objectFit: 'cover',
                                                borderRadius: '4px'
                                            }}
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        )}
                    </Box>
                </Paper>
            )}

            {/* Recipe Details */}
            <Paper elevation={3} sx={{p: 2, mb: 3}}>
                <Box sx={{display: 'flex', gap: 3, flexWrap: 'wrap'}}>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <AccessTimeIcon color="primary" sx={{mr: 1}}/>
                        <Typography variant="body1">
                            {recipe.prep_time} minutes
                        </Typography>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <RestaurantIcon color="primary" sx={{mr: 1}}/>
                        <Typography variant="body1">
                            {recipe.servings} {recipe.servings === 1 ? 'serving' : 'servings'}
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Ingredients */}
            <Paper elevation={3} sx={{p: 3, mb: 3}}>
                <Typography variant="h5" gutterBottom>
                    Ingredients
                </Typography>
                <Divider sx={{mb: 2}}/>
                <List>
                    {recipe.ingredients.map((ingredient) => (
                        <ListItem key={ingredient.id} sx={{py: 0.5}}>
                            <ListItemIcon sx={{minWidth: 30}}>
                                <span style={{color: theme.palette.primary.main}}>•</span>
                            </ListItemIcon>
                            <ListItemText
                                primary={`${ingredient.amount} ${ingredient.name}`}
                                primaryTypographyProps={{variant: 'body1'}}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {/* Instructions */}
            <Paper elevation={3} sx={{p: 3, mb: 3}}>
                <Typography variant="h5" gutterBottom>
                    Instructions
                </Typography>
                <Divider sx={{mb: 2}}/>
                <List>
                    {recipe.steps
                        .sort((a, b) => a.step_number - b.step_number)
                        .map((step, index) => (
                            <React.Fragment key={step.id}>
                                <ListItem alignItems="flex-start" sx={{py: 2}}>
                                    <ListItemText
                                        primary={
                                            <Box sx={{display: 'flex', alignItems: 'flex-start'}}>
                                                <Avatar sx={{
                                                    bgcolor: theme.palette.primary.main,
                                                    width: 24,
                                                    height: 24,
                                                    mr: 2,
                                                    mt: 0.5
                                                }}>
                                                    {step.step_number}
                                                </Avatar>
                                                <Typography variant="body1">
                                                    {step.instruction}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {index < recipe.steps.length - 1 && <Divider variant="middle"/>}
                            </React.Fragment>
                        ))}
                </List>
            </Paper>

            {/* Author's Note */}
            {recipe.author_note && (
                <Paper elevation={3} sx={{p: 3, mb: 3}}>
                    <Typography variant="h5" gutterBottom>
                        Author's Note
                    </Typography>
                    <Divider sx={{mb: 2}}/>
                    <Typography variant="body1">
                        {recipe.author_note}
                    </Typography>
                </Paper>
            )}

            {/* Footer */}
            <Paper elevation={3} sx={{p: 3}}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: 2
                }}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                        <Avatar
                            src={recipe.author.avatarUrl}
                            alt={`${recipe.author.firstName} ${recipe.author.lastName}`}
                            sx={{width: 56, height: 56}}
                        />
                        <Box>
                            <Typography variant="body1" fontWeight="medium">
                                {recipe.author.firstName} {recipe.author.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {new Date(recipe.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        justifyContent: isMobile ? 'flex-start' : 'flex-end'
                    }}>
                        {recipe.tags.map((tag, index) => (
                            <Chip
                                key={index}
                                label={`#${tag}`}
                                variant="outlined"
                                size="small"
                            />
                        ))}
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default RecipePage;