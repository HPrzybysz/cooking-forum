import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import '../styles/PopularSlider.scss';
import RecipeCard from './RecipeCard';
import {getPopularRecipes} from '../services/recipeService';

interface Recipe {
    id: string;
    title: string;
    imageUrl: string;
}

const PopularSlider: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPopularRecipes = async () => {
            try {
                const data = await getPopularRecipes();
                setRecipes(data);
            } catch (error) {
                console.error('Error fetching popular recipes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPopularRecipes();
    }, []);

    const goToPrev = () => {
        setCurrentIndex(prev => (prev === 0 ? recipes.length - 1 : prev - 1));
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 3000);
    };

    const goToNext = () => {
        setCurrentIndex(prev => (prev === recipes.length - 1 ? 0 : prev + 1));
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 3000);
    };

    useEffect(() => {
        if (isPaused || recipes.length === 0) return;

        const interval = setInterval(() => {
            goToNext();
        }, 3000);

        return () => clearInterval(interval);
    }, [isPaused, recipes.length]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (recipes.length === 0) {
        return null;
    }

    return (
        <section className="popular-recipes">
            <h2>Popular Recipes</h2>
            <div
                className="slider-container"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <button className="slider-arrow left-arrow" onClick={goToPrev}>
                    &#10094;
                </button>

                <div className="slider-track">
                    {recipes.map((recipe, index) => (
                        <div
                            key={recipe.id}
                            className="slide"
                            style={{
                                transform: `translateX(${100 * (index - currentIndex)}%)`,
                            }}
                        >
                            <RecipeCard
                                image={recipe.imageUrl || 'https://placehold.co/600x400'}
                                title={recipe.title}
                                onClick={() => navigate(`/recipe/${recipe.id}`)}
                            />
                        </div>
                    ))}
                </div>

                <button className="slider-arrow right-arrow" onClick={goToNext}>
                    &#10095;
                </button>
            </div>
        </section>
    );
};

export default PopularSlider;