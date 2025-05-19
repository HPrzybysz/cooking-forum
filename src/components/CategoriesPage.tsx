import React from 'react';
import {Box, Typography, Button} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import '../styles/CategoriesPage.scss';

interface Category {
    id: string;
    name: string;
    imageUrl: string;
}

const CategoriesPage: React.FC = () => {
    const navigate = useNavigate();

    const categories: Category[] = [
        {
            id: '1',
            name: 'Breakfast',
            imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop'
        },
        {
            id: '2',
            name: 'Dinner',
            imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop'
        },
        {
            id: '3',
            name: 'Desserts',
            imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop'
        },
        {
            id: '4',
            name: 'Snacks',
            imageUrl: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&auto=format&fit=crop'
        },
        {
            id: '5',
            name: 'Salads',
            imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop'
        },
        {
            id: '6',
            name: 'Oven',
            imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop'
        },
    ];

    const handleCategoryClick = (categoryId: string) => {
        // To do - database needed
        console.log(`Selected category: ${categoryId}`);
    };

    return (
        <Box className="categories-page">
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
                Recipe Categories
            </Typography>

            <Box className="categories-grid">
                {categories.map((category) => (
                    <Box
                        key={category.id}
                        className="category-card"
                        onClick={() => handleCategoryClick(category.id)}
                    >
                        <Box className="category-image">
                            <img src={category.imageUrl} alt={category.name}/>
                        </Box>
                        <Typography variant="h3" className="category-name">
                            {category.name}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default CategoriesPage;