import React, {useEffect, useState} from 'react';
import {Box, Typography, Button, CircularProgress, Grid} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {getCategories} from '../services/categoryService';
import '../styles/CategoriesPage.scss';

interface Category {
    id: string;
    name: string;
    imageUrl: string;
}

const CategoriesPage: React.FC = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                if (isMounted) {
                    setCategories(data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchCategories();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleCategoryClick = (categoryId: string) => {
        navigate(`/category/${categoryId}`);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress/>
            </Box>
        );
    }

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

            <Grid container spacing={3} className="categories-grid">
                {categories.map((category) => (
                    <Grid item xs={12} sm={6} md={4} key={category.id}>
                        <Box
                            className="category-card"
                            onClick={() => handleCategoryClick(category.id)}
                        >
                            <Typography variant="h3" className="category-name">
                                {category.name}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default CategoriesPage;