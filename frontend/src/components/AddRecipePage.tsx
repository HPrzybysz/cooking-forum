import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    TextField,
    Chip,
    InputAdornment,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    SelectChangeEvent,
    CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {createRecipe} from '../services/recipeService';
import {getCategories} from '../services/categoryService';
import {getTags} from '../services/tagService';
import api from '../api/index';
import {useAuth} from '../context/AuthContext';
import '../styles/AddRecipePage.scss';

interface Ingredient {
    id: string;
    name: string;
    amount: string;
}

interface Step {
    id: string;
    instruction: string;
}

interface Category {
    id: string;
    name: string;
}

const AddRecipePage: React.FC = () => {
    const navigate = useNavigate();
    const {user} = useAuth();
    const [recipeData, setRecipeData] = useState({
        title: '',
        description: '',
        prepTime: '',
        servings: '',
        equipment: '',
        authorNote: '',
        category: '',
    });
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [steps, setSteps] = useState<Step[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [newIngredient, setNewIngredient] = useState({
        name: '',
        amount: ''
    });
    const [loading, setLoading] = useState(false);
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [availableTags, setAvailableTags] = useState<string[]>([]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!user) {
                throw new Error('User not authenticated');
            }

            const result = await createRecipe({
                title: recipeData.title,
                description: recipeData.description,
                prep_time: recipeData.prepTime ? parseInt(recipeData.prepTime) : null,
                servings: recipeData.servings ? parseInt(recipeData.servings) : null,
                equipment: recipeData.equipment || null,
                author_note: recipeData.authorNote || null,
                category_id: recipeData.category ? parseInt(recipeData.category) : null,
                ingredients: ingredients.map(ing => ({
                    name: ing.name,
                    amount: ing.amount
                })),
                steps: steps
                    .filter(step => step.instruction.trim())
                    .map((step, index) => ({
                        step_number: index + 1,
                        instruction: step.instruction
                    })),
                tags
            }, user.id);

            // image uploads
            if (imageFiles.length > 0) {
                const formData = new FormData();
                imageFiles.forEach((file, index) => {
                    formData.append('images', file);
                    if (index === 0) {
                        formData.append('isPrimary', 'true');
                    }
                });

                await api.post(`/api/recipes/${result.recipeId}/images`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            navigate(`/recipe/${result.recipeId}`);
        } catch (error: any) {
            console.error('Error creating recipe:', error);
            alert(error.response?.data?.error || error.message || 'Failed to create recipe. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            images.forEach(image => URL.revokeObjectURL(image));
        };
    }, [images]);


    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [categories, tags] = await Promise.all([
                    getCategories(),
                    getTags()
                ]);
                setAvailableCategories(categories);
                setAvailableTags(tags.map(tag => tag.name)); // Set available tags from backend
            } catch (error) {
                console.error('Failed to load initial data', error);
            }
        };
        fetchInitialData();
    }, []);


    //hashtags for suggestions
    const suggestedTags = availableTags.filter(tag => !tags.includes(tag));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setRecipeData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCategoryChange = (e: SelectChangeEvent) => {
        setRecipeData(prev => ({
            ...prev,
            category: e.target.value
        }));
    };

    const handleAddIngredient = () => {
        if (newIngredient.name.trim() && newIngredient.amount.trim()) {
            setIngredients(prev => [
                ...prev,
                {
                    id: Date.now().toString(),
                    ...newIngredient
                }
            ]);
            setNewIngredient({name: '', amount: ''});
        }
    };

    const handleRemoveIngredient = (id: string) => {
        setIngredients(prev => prev.filter(item => item.id !== id));
    };

    const handleAddStep = () => {
        setSteps(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                instruction: ''
            }
        ]);
    };

    const handleStepChange = (id: string, value: string) => {
        setSteps(prev => prev.map(step =>
            step.id === id ? {...step, instruction: value} : step
        ));
    };

    const handleRemoveStep = (id: string) => {
        setSteps(prev => prev.filter(step => step.id !== id));
    };

    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags(prev => [...prev, newTag.trim()]);
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(prev => prev.filter(tag => tag !== tagToRemove));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files).slice(0, 5 - images.length);
            setImageFiles(prev => [...prev, ...files]);

            // Create preview URLs
            const newImages = files.map(file => URL.createObjectURL(file));
            setImages(prev => [...prev, ...newImages]);
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <Box className="add-recipe-page">
            <Button
                variant="contained"
                onClick={() => navigate('/')}
                sx={{
                    backgroundColor: '#F59E0B',
                    color: 'white',
                    margin: '1rem',
                    '&:hover': {
                        backgroundColor: '#D48A08'
                    }
                }}
            >
                Back to Main Page
            </Button>

            <Typography variant="h2" component="h1" className="page-title">
                Add New Recipe
            </Typography>

            <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <Box className="section">
                    <Typography variant="h3" className="section-title">
                        Basic Information
                    </Typography>
                    <TextField
                        fullWidth
                        label="Recipe Title"
                        name="title"
                        value={recipeData.title}
                        onChange={handleInputChange}
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={recipeData.description}
                        onChange={handleInputChange}
                        multiline
                        rows={3}
                        margin="normal"
                        required
                    />
                </Box>

                {/* Images */}
                <Box className="section">
                    <Typography variant="h3" className="section-title">
                        Images (Max 5)
                    </Typography>
                    <Box className="image-upload-container">
                        {images.map((img, index) => (
                            <Box key={index} className="image-preview">
                                <img src={img} alt={`Preview ${index}`}/>
                                <IconButton
                                    className="remove-image"
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    <CloseIcon/>
                                </IconButton>
                            </Box>
                        ))}
                        {images.length < 5 && (
                            <Button
                                variant="outlined"
                                component="label"
                                className="upload-button"
                            >
                                Upload Image
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                />
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Details */}
                <Box className="section">
                    <Typography variant="h3" className="section-title">
                        Details
                    </Typography>
                    <Box className="details-grid">
                        <TextField
                            label="Preparation Time (minutes)"
                            name="prepTime"
                            value={recipeData.prepTime}
                            onChange={handleInputChange}
                            type="number"
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <AccessTimeIcon/>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Servings"
                            name="servings"
                            value={recipeData.servings}
                            onChange={handleInputChange}
                            type="number"
                            required
                        />
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={recipeData.category}
                                label="Category"
                                onChange={handleCategoryChange}
                                required
                            >
                                {availableCategories.map(category => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Equipment Needed (optional)"
                            name="equipment"
                            value={recipeData.equipment}
                            onChange={handleInputChange}
                        />
                    </Box>
                </Box>

                {/* Ingredients */}
                <Box className="section">
                    <Typography variant="h3" className="section-title">
                        Ingredients
                    </Typography>
                    <Box className="ingredients-list">
                        {ingredients.map(ingredient => (
                            <Box key={ingredient.id} className="ingredient-item">
                                <Typography>
                                    {ingredient.amount} {ingredient.name}
                                </Typography>
                                <IconButton onClick={() => handleRemoveIngredient(ingredient.id)}>
                                    <CloseIcon fontSize="small"/>
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                    <Box className="add-ingredient">
                        <TextField
                            label="Ingredient Name"
                            value={newIngredient.name}
                            onChange={(e) => setNewIngredient(prev => ({...prev, name: e.target.value}))}
                            margin="normal"
                            size="small"
                        />
                        <TextField
                            label="Amount"
                            value={newIngredient.amount}
                            onChange={(e) => setNewIngredient(prev => ({...prev, amount: e.target.value}))}
                            margin="normal"
                            size="small"
                        />
                        <Button
                            variant="contained"
                            onClick={handleAddIngredient}
                            disabled={!newIngredient.name.trim() || !newIngredient.amount.trim()}
                            startIcon={<AddIcon/>}
                            sx={{marginLeft: '1rem'}}
                        >
                            Add
                        </Button>
                    </Box>
                </Box>

                {/* Prep steps */}
                <Box className="section">
                    <Typography variant="h3" className="section-title">
                        Preparation Steps
                    </Typography>
                    <Box className="steps-list">
                        {steps.map((step, index) => (
                            <Box key={step.id} className="step-item">
                                <Typography variant="body1" className="step-number">
                                    {index + 1}.
                                </Typography>
                                <TextField
                                    fullWidth
                                    value={step.instruction}
                                    onChange={(e) => handleStepChange(step.id, e.target.value)}
                                    multiline
                                    variant="outlined"
                                />
                                <IconButton onClick={() => handleRemoveStep(step.id)}>
                                    <CloseIcon/>
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                    <Button
                        variant="outlined"
                        onClick={handleAddStep}
                        startIcon={<AddIcon/>}
                        sx={{marginTop: '1rem'}}
                    >
                        Add Step
                    </Button>
                </Box>

                {/* Tags */}
                <Box className="section">
                    <Typography variant="h3" className="section-title">
                        Tags
                    </Typography>
                    <Box className="tags-container">
                        {tags.map(tag => (
                            <Chip
                                key={tag}
                                label={`#${tag}`}
                                onDelete={() => handleRemoveTag(tag)}
                                sx={{margin: '0.25rem'}}
                            />
                        ))}
                    </Box>
                    <Box className="add-tag">
                        <TextField
                            label="Add Tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            margin="normal"
                            size="small"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        />
                        <Button
                            variant="contained"
                            onClick={handleAddTag}
                            disabled={!newTag.trim()}
                            startIcon={<AddIcon/>}
                            sx={{marginLeft: '1rem'}}
                        >
                            Add
                        </Button>
                    </Box>
                    <Typography variant="h6" sx={{marginTop: '0.5rem', fontSize: "1rem"}}>
                        Suggestions: {suggestedTags.map(tag => (
                        <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            onClick={() => {
                                if (!tags.includes(tag)) {
                                    setTags(prev => [...prev, tag]);
                                }
                            }}
                            sx={{margin: '0.25rem', cursor: 'pointer'}}
                            color={tags.includes(tag) ? 'primary' : 'default'}
                        />
                    ))}
                    </Typography>
                </Box>

                {/* Author's Note */}
                <Box className="section">
                    <Typography variant="h3" className="section-title">
                        Author's Note (optional)
                    </Typography>
                    <TextField
                        fullWidth
                        label="Your personal notes about this recipe"
                        name="authorNote"
                        value={recipeData.authorNote}
                        onChange={handleInputChange}
                        multiline
                        rows={3}
                        margin="normal"
                    />
                </Box>

                <Box className="submit-section">
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={
                            loading ||
                            !recipeData.title ||
                            !recipeData.description ||
                            !recipeData.prepTime ||
                            !recipeData.servings ||
                            !recipeData.category ||
                            ingredients.length === 0 ||
                            steps.filter(step => step.instruction.trim()).length === 0
                        }
                        sx={{
                            backgroundColor: '#F59E0B',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#D48A08'
                            }
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit"/> : 'Save Recipe'}
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default AddRecipePage;