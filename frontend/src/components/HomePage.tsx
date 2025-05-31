import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import PopularSlider from './PopularSlider';
import '../styles/HomePage.scss';
import {Recipe, RecipeImage} from './types';
import api from '../api';
import {getRecipeImages} from "../services/recipeImageService.ts";
import {getImageUrl} from "../utils/imageUtils.ts";

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [featuredRecipe, setFeaturedRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [featuredImages, setFeaturedImages] = useState<RecipeImage[]>([]);
    // @ts-ignore
    const [imageLoading, setImageLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedRecipe = async () => {
            try {
                const response = await api.get('/api/stats/popular?limit=10');
                const popularRecipes = response.data;

                if (popularRecipes.length > 0) {
                    const randomIndex = Math.floor(Math.random() * popularRecipes.length);
                    setFeaturedRecipe(popularRecipes[randomIndex]);
                }
            } catch (err) {
                setError('Failed to load featured recipe');
                console.error('Error fetching featured recipe:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedRecipe();
    }, []);

    useEffect(() => {
        if (featuredRecipe) {
            const fetchImages = async () => {
                try {
                    const fetchedImages = await getRecipeImages(featuredRecipe.id.toString());
                    setFeaturedImages(fetchedImages);
                } catch (error) {
                    console.error('Error fetching images:', error);
                } finally {
                    setImageLoading(false);
                }
            };
            fetchImages();
        }
    }, [featuredRecipe]);

    const handleReadMore = () => {
        if (featuredRecipe) {
            navigate(`/recipe/${featuredRecipe.id}`);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!featuredRecipe) {
        return <div>No featured recipe available</div>;
    }

    return (
        <main className="main-content">
            <section className="featured-recipe">
                <h2>Recipe of the day</h2>
                <div className="featured-content">
                    <div className="left">
                        <img
                            id="dish"
                            // @ts-ignore
                            src={getImageUrl(featuredImages.find(img => img.is_primary) || featuredImages[0])}
                            alt="Dish Image"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/600x400';
                            }}
                        />
                        <hr/>
                    </div>
                    <div className="right">
                        <h1 className="featured-recipe__title">{featuredRecipe.title}</h1>
                        <hr/>
                        <p id="description">
                            {featuredRecipe.description}
                        </p>
                        <button
                            className="read-more-button"
                            onClick={handleReadMore}
                        >
                            Read more
                        </button>
                    </div>
                </div>
            </section>
            <section className="popular-recipes">
                <PopularSlider/>
            </section>
        </main>
    );
};

export default HomePage;