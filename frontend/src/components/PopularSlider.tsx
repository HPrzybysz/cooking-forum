import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Recipe} from './types';
import {getPopularRecipes} from '../services/popularService';
import {
    Box,
    IconButton,
    Typography,
    useTheme,
    useMediaQuery,
    Skeleton
} from '@mui/material';
import {
    ArrowBackIos as ArrowBackIcon,
    ArrowForwardIos as ArrowForwardIcon
} from '@mui/icons-material';
import RecipeCard from './RecipeCard';

const PopularSlider: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const slidesToShow = isMobile ? 1 : isTablet ? 2 : 3;

    useEffect(() => {
        const fetchPopularRecipes = async () => {
            try {
                const popularRecipes = await getPopularRecipes(10);
                setRecipes(popularRecipes);
            } catch (error) {
                console.error('Error fetching popular recipes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPopularRecipes();
    }, []);

    const goToPrev = () => {
        setCurrentIndex(prev =>
            prev === 0 ? recipes.length - slidesToShow : prev - 1
        );
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 3000);
    };

    const goToNext = () => {
        setCurrentIndex(prev =>
            prev >= recipes.length - slidesToShow ? 0 : prev + 1
        );
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 3000);
    };

    useEffect(() => {
        if (isPaused || recipes.length === 0) return;

        const interval = setInterval(() => {
            goToNext();
        }, 3000);

        return () => clearInterval(interval);
    }, [isPaused, recipes.length, slidesToShow]);

    if (loading) {
        return (
            <Box sx={{display: 'flex', gap: 2, overflow: 'hidden', my: 4}}>
                {[...Array(slidesToShow)].map((_, index) => (
                    <Box key={index} sx={{flex: `0 0 calc(100% / ${slidesToShow} - 16px)`}}>
                        <Skeleton variant="rectangular" height={200} sx={{mb: 1}}/>
                        <Skeleton variant="text" width="80%"/>
                        <Skeleton variant="text" width="60%"/>
                    </Box>
                ))}
            </Box>
        );
    }

    if (recipes.length === 0) {
        return null;
    }

    const visibleRecipes = [];
    for (let i = 0; i < slidesToShow; i++) {
        const index = (currentIndex + i) % recipes.length;
        visibleRecipes.push(recipes[index]);
    }

    return (
        <Box sx={{my: 4, position: 'relative', width: '100%'}}>
            <Typography variant="h5" component="h2" sx={{mb: 2, textAlign: 'center'}}>
                Top Rated Recipes
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    width: '100%',
                    overflow: 'hidden'
                }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <IconButton
                    onClick={goToPrev}
                    sx={{
                        position: 'absolute',
                        left: 0,
                        zIndex: 1,
                        bgcolor: 'background.paper',
                        '&:hover': {
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText'
                        }
                    }}
                >
                    <ArrowBackIcon/>
                </IconButton>

                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        width: '100%',
                        px: 6,
                        transition: 'transform 0.5s ease',
                        transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`
                    }}
                >
                    {recipes.map((recipe) => (
                        <Box
                            key={recipe.id}
                            sx={{
                                flex: `0 0 calc(100% / ${slidesToShow} - 16px)`,
                                minWidth: 0
                            }}
                        >
                            <RecipeCard
                                recipeId={recipe.id}
                                title={recipe.title}
                                onClick={() => navigate(`/recipe/${recipe.id}`)}
                                statistics={recipe.statistics}
                            />
                        </Box>
                    ))}
                </Box>

                <IconButton
                    onClick={goToNext}
                    sx={{
                        position: 'absolute',
                        right: 0,
                        zIndex: 1,
                        bgcolor: 'background.paper',
                        '&:hover': {
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText'
                        }
                    }}
                >
                    <ArrowForwardIcon/>
                </IconButton>
            </Box>

            {!isMobile && (
                <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                    {Array.from({length: Math.ceil(recipes.length / slidesToShow)}).map((_, i) => (
                        <IconButton
                            key={i}
                            size="small"
                            onClick={() => setCurrentIndex(i * slidesToShow)}
                            sx={{
                                width: 8,
                                height: 8,
                                p: 0,
                                mx: 0.5,
                                bgcolor: currentIndex >= i * slidesToShow &&
                                currentIndex < (i + 1) * slidesToShow
                                    ? 'primary.main' : 'grey.400',
                                '&:hover': {
                                    bgcolor: 'primary.main'
                                }
                            }}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default PopularSlider;