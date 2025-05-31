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
    CircularProgress,
    Autocomplete,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {createRecipe} from '../services/recipeService';
import {getCategories, createCategory} from '../services/categoryService';
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

interface ImageValidationError {
    fileName: string;
    error: string;
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
    const [images, setImages] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [newIngredient, setNewIngredient] = useState({
        name: '',
        amount: ''
    });
    const [loading, setLoading] = useState(false);
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [categoryLoading, setCategoryLoading] = useState(false);
    const [imageErrors, setImageErrors] = useState<ImageValidationError[]>([]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (imageErrors.length > 0) {
            alert('Please fix image upload errors before submitting');
            return;
        }

        if (!recipeData.prepTime || isNaN(Number(recipeData.prepTime))) {
            alert('Please enter a valid preparation time');
            return;
        }

        if (!recipeData.servings || isNaN(Number(recipeData.servings))) {
            alert('Please enter a valid number of servings');
            return;
        }

        setLoading(true);

        try {
            if (!user) {
                throw new Error('User not authenticated');
            }

            if (imageFiles.length > 0) {
                const formData = new FormData();
                // @ts-ignore
                imageFiles.forEach((file, index) => {
                    formData.append('images', file);
                });

                const validationResponse = await api.post('/api/recipes/images/pre-upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (!validationResponse.data.success) {
                    throw new Error('Image validation failed');
                }
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
                setAvailableTags(tags.map(tag => tag.name));
            } catch (error) {
                console.error('Failed to load initial data', error);
            }
        };
        fetchInitialData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setRecipeData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;

        setCategoryLoading(true);
        try {
            const newCategory = await createCategory({name: newCategoryName});
            setAvailableCategories(prev => [...prev, newCategory]);
            setRecipeData(prev => ({
                ...prev,
                category: newCategory.id.toString()
            }));
            setIsCategoryDialogOpen(false);
            setNewCategoryName('');
        } catch (error) {
            console.error('Error creating category:', error);
            alert('Failed to create category. Please try again.');
        } finally {
            setCategoryLoading(false);
        }
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
    const handleTagsChange = (_event: React.SyntheticEvent, value: string[]) => {
        setTags(value);
    };


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
            const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20MB total
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];

            const newErrors: ImageValidationError[] = [];
            const validFiles: File[] = [];
            let totalSize = imageFiles.reduce((sum, file) => sum + file.size, 0);
            let hasSizeError = false;

            Array.from(e.target.files).forEach(file => {
                if (file.size > MAX_FILE_SIZE) {
                    newErrors.push({
                        fileName: file.name,
                        error: `File exceeds maximum size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
                    });
                    hasSizeError = true;
                } else if (!validTypes.includes(file.type)) {
                    newErrors.push({
                        fileName: file.name,
                        error: 'Invalid file type. Only JPEG, PNG, and GIF are allowed'
                    });
                } else if (totalSize + file.size > MAX_TOTAL_SIZE) {
                    newErrors.push({
                        fileName: file.name,
                        error: 'Total size of all images would exceed maximum limit'
                    });
                } else {
                    validFiles.push(file);
                    totalSize += file.size;
                }
            });

            setImageErrors(newErrors);

            if (hasSizeError) {
                alert(`Some files exceed the maximum size limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB per file. Please upload smaller files.`);
            }

            if (validFiles.length > 0) {
                const filesToAdd = validFiles.slice(0, 5 - images.length);
                setImageFiles(prev => [...prev, ...filesToAdd]);

                const newImages = filesToAdd.map(file => URL.createObjectURL(file));
                setImages(prev => [...prev, ...newImages]);
            }
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImageErrors(prev => prev.filter(err =>
            !imageFiles[index] || err.fileName !== imageFiles[index].name
        ));
    };

    {
        imageErrors.length > 0 && (
            <Box sx={{color: 'error.main', mt: 1}}>
                {imageErrors.map((err, index) => (
                    <Typography key={index} variant="body2">
                        {err.fileName}: {err.error}
                    </Typography>
                ))}
            </Box>
        )
    }

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
                    <Typography variant="caption" sx={{display: 'block', mb: 1}}>
                        Maximum file size: 10MB per image, 20MB total
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
                    {imageErrors.length > 0 && (
                        <Box sx={{color: 'error.main', mt: 1}}>
                            {imageErrors.map((err, index) => (
                                <Typography key={index} variant="body2">
                                    {err.fileName}: {err.error}
                                </Typography>
                            ))}
                        </Box>
                    )}
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
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || /^[0-9\b]+$/.test(value)) {
                                    setRecipeData(prev => ({
                                        ...prev,
                                        prepTime: value
                                    }));
                                }
                            }}
                            type="number"
                            required
                            inputProps={{min: 1, max: 999}}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <AccessTimeIcon/>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            label="Number of servings"
                            name="servings"
                            value={recipeData.servings}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || /^[0-9\b]+$/.test(value)) {
                                    setRecipeData(prev => ({
                                        ...prev,
                                        servings: value
                                    }));
                                }
                            }}
                            type="number"
                            required
                            inputProps={{min: 1, max: 200}}
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
                                <MenuItem onClick={() => setIsCategoryDialogOpen(true)}>
                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                        <AddIcon sx={{mr: 1}}/>
                                        Create New Category
                                    </Box>
                                </MenuItem>
                            </Select>
                        </FormControl>
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
                    <Autocomplete
                        multiple
                        options={availableTags}
                        value={tags}
                        onChange={handleTagsChange}
                        freeSolo
                        renderTags={(value: string[], getTagProps) =>
                            value.map((option: string, index: number) => (
                                <Chip
                                    label={`#${option}`}
                                    {...getTagProps({index})}
                                    sx={{margin: '0.25rem'}}
                                />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Add Tags"
                                margin="normal"
                                size="small"
                            />
                        )}
                    />
                    <Typography variant="caption" sx={{mt: 1, display: 'block'}}>
                        Start typing to see suggestions or create new tag and press enter
                    </Typography>
                </Box>

                <Dialog open={isCategoryDialogOpen} onClose={() => setIsCategoryDialogOpen(false)}>
                    <DialogTitle>Create New Category</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Category Name"
                            fullWidth
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleCreateCategory}
                            disabled={!newCategoryName.trim() || categoryLoading}
                            startIcon={categoryLoading ? <CircularProgress size={20}/> : null}
                        >
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>

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