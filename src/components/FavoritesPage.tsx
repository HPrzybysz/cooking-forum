import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Checkbox,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useMediaQuery,
    useTheme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import '../styles/FavoritesPage.scss';

interface Recipe {
    id: string;
    title: string;
    imageUrl: string;
    isFavorite: boolean;
}

const FavoritesPage: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showSelection, setShowSelection] = useState(false);

    //mock data
    const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([
        {
            id: '1',
            title: 'Pasta Carbonara',
            imageUrl: 'https://placehold.co/300x200',
            isFavorite: true
        },
        {
            id: '2',
            title: 'Chicken Curry',
            imageUrl: 'https://placehold.co/300x200',
            isFavorite: true
        },
        {
            id: '3',
            title: 'Chocolate Cake',
            imageUrl: 'https://placehold.co/300x200',
            isFavorite: true
        },
        {
            id: '4',
            title: 'Vegetable Stir Fry',
            imageUrl: 'https://placehold.co/300x200',
            isFavorite: true
        },
        {
            id: '5',
            title: 'Beef Burger',
            imageUrl: 'https://placehold.co/300x200',
            isFavorite: true
        },
    ]);

    const toggleRecipeSelection = (recipeId: string) => {
        setSelectedRecipes(prev =>
            prev.includes(recipeId)
                ? prev.filter(id => id !== recipeId)
                : [...prev, recipeId]
        );
    };

    const handleDeleteFavorites = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            setFavoriteRecipes(prev =>
                prev.filter(recipe => !selectedRecipes.includes(recipe.id))
            );
            setSelectedRecipes([]);
            setShowSelection(false);
            setIsDeleteDialogOpen(false);
        } catch (error) {
            console.error('Error deleting favorites:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box className="favorites-page">
            <Box className="page-header">
                <Typography variant="h3" component="h1" className="page-title">
                    My Favorites
                </Typography>

                <Box className="action-buttons">
                    {showSelection ? (
                        <>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setShowSelection(false);
                                    setSelectedRecipes([]);
                                }}
                                sx={{ mr: 1 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => setIsDeleteDialogOpen(true)}
                                disabled={selectedRecipes.length === 0 || isLoading}
                            >
                                Remove ({selectedRecipes.length})
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            onClick={() => setShowSelection(true)}
                        >
                            Remove Recipes
                        </Button>
                    )}
                </Box>
            </Box>

            {favoriteRecipes.length === 0 ? (
                <Paper elevation={3} className="empty-state">
                    <Typography variant="body1">
                        You don't have favourite recipes yet.
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={3} className="recipes-grid" justifyContent="center">
                    {favoriteRecipes.map((recipe) => (
                        <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                            <Paper elevation={2} className="recipe-card">
                                {showSelection && (
                                    <Box className="recipe-checkbox">
                                        <Checkbox
                                            checked={selectedRecipes.includes(recipe.id)}
                                            onChange={() => toggleRecipeSelection(recipe.id)}
                                            icon={<CheckBoxOutlineBlankIcon />}
                                            checkedIcon={<CheckBoxIcon sx={{ color: 'black' }} />}
                                        />
                                    </Box>
                                )}
                                <img
                                    src={recipe.imageUrl}
                                    alt={recipe.title}
                                    className="recipe-image"
                                />
                                <Typography variant="h6" className="recipe-title">
                                    {recipe.title}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/*confirmation dialog */}
            <Dialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
            >
                <DialogTitle>Remove from Favorites?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to remove {selectedRecipes.length}
                        {selectedRecipes.length === 1 ? ' recipe' : ' recipes'} from your favorites?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setIsDeleteDialogOpen(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteFavorites}
                        color="error"
                        startIcon={isLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
                        disabled={isLoading}
                    >
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FavoritesPage;