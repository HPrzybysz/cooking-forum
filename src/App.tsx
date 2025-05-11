import React, {useState} from 'react';
import {CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import PopularSlider from "./components/PopularSlider.tsx";
import RecipePage from './components/RecipePage';
import { Recipe } from './components/types.ts';
import './App.scss';
import LoginPage from './components/LoginPage';

const sampleRecipe: Recipe = {
    id: '1',
    title: 'Delicious Pasta Carbonara',
    imageUrl: 'https://placehold.co/600x400',
    prepTime: 30,
    ingredients: [
        '400g spaghetti',
        '200g pancetta or guanciale, diced',
        '4 large eggs',
        '50g pecorino cheese, grated',
        '50g parmesan, grated',
        'Freshly ground black pepper',
        'Salt',
        '2 garlic cloves, peeled'
    ],
    instructions: [
        'Bring a large pot of salted water to boil and cook spaghetti according to package instructions.',
        'While pasta cooks, fry the pancetta in a large pan until crispy. Add garlic for the last minute of cooking, then remove garlic.',
        'In a bowl, whisk eggs and mix in grated cheeses and plenty of black pepper.',
        'Drain pasta, reserving some cooking water. Quickly add hot pasta to the pancetta, then remove from heat.',
        'Working quickly, pour in the egg mixture, stirring constantly. Add pasta water as needed to create a creamy sauce.',
        'Serve immediately with extra grated cheese and black pepper.'
    ],
    author: {
        name: 'Chef Mario',
        avatarUrl: 'https://placehold.co/100'
    },
    tags: ['pasta', 'italian', 'dinner', 'comfort-food']
};

const theme = createTheme({
    palette: {
        primary: {
            main: '#F59E0B',
        },
        background: {
            default: '#FFFFFF',
            paper: '#FFFFFF',
        },
    },
});


const App: React.FC = () => {
    const [showRecipePage, setShowRecipePage] = useState(false);
    const [showLoginPage, setShowLoginPage] = useState(false);
    const placeholderImages: string[] = Array(5).fill('https://placehold.co/150x150');

    const handleReadMore = () => {
        setShowRecipePage(true);
    };

    const handleBackToHome = () => {
        setShowRecipePage(false);
    };

    const handleLoginClick = () => {
        setShowLoginPage(true);
    };

    const handleCloseLogin = () => {
        setShowLoginPage(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="app">
                <Header onLoginClick={handleLoginClick} />
                {showLoginPage && (
                    <div className="login-modal-overlay">
                        <div className="login-modal">
                            <IconButton
                                className="close-login"
                                onClick={handleCloseLogin}
                                sx={{
                                    position: 'absolute',
                                    top: 20,
                                    right: 20,
                                    color: 'white',
                                    fontSize: '2rem',
                                    zIndex: 1001
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <LoginPage onClose={handleCloseLogin} />
                        </div>
                    </div>
                )}
                {!showLoginPage && (
                    <main className="main-content">
                        {showRecipePage ? (
                            <>
                                <button
                                    onClick={handleBackToHome}
                                    className="back-button"
                                >
                                    ← Back to Home
                                </button>
                                <RecipePage recipe={sampleRecipe} />
                            </>
                        ) : (
                            <>
                                <SearchBar/>

                                <section className="featured-recipe">
                                    <h2>Recipe of the day</h2>

                                    <div className="featured-content">
                                        <div className="left">
                                            <img id="dish" src="https://placehold.co/150x150" alt="Dish Image"/>
                                            <hr/>
                                            <img id="user" src="https://placehold.co/60x60" alt="user"/>
                                            <h6>Jan Kowalski</h6>
                                        </div>

                                        <div className="right">
                                            <h1 className="featured-recipe__title">{sampleRecipe.title}</h1>
                                            <hr/>
                                            <p id="description">
                                                {sampleRecipe.instructions.join(' ').substring(0, 200)}...
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
                                    <PopularSlider images={placeholderImages}/>
                                </section>
                            </>
                        )}
                    </main>
                )}
            </div>
        </ThemeProvider>
    );
};

export default App;