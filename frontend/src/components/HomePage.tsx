import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import PopularSlider from './PopularSlider';
import '../styles/HomePage.scss';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const featuredRecipe = {
        id: '1',
        title: 'Featured Recipe',
        imageUrl: 'https://placehold.co/600x400',
        author: {
            name: 'Chef Name',
            avatarUrl: 'https://placehold.co/100'
        },
        description: 'This is a description of the featured recipe...'
    };

    const placeholderImages: string[] = Array(5).fill('https://placehold.co/150x150');

    const handleReadMore = () => {
        navigate(`/recipe/${featuredRecipe.id}`);
    };

    return (
        <main className="main-content">
            <SearchBar />
            <section className="featured-recipe">
                <h2>Recipe of the day</h2>
                <div className="featured-content">
                    <div className="left">
                        <img id="dish" src={featuredRecipe.imageUrl} alt="Dish Image" />
                        <hr />
                        <img id="user" src={featuredRecipe.author.avatarUrl} alt="user" />
                        <h6>{featuredRecipe.author.name}</h6>
                    </div>
                    <div className="right">
                        <h1 className="featured-recipe__title">{featuredRecipe.title}</h1>
                        <hr />
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
                <PopularSlider images={placeholderImages} />
            </section>
        </main>
    );
};

export default HomePage;