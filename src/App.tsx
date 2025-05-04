import React from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import PopularSlider from "./components/PopularSlider.tsx";
import './App.scss';

const App: React.FC = () => {
    const placeholderImages: string[] = Array(5).fill('https://placehold.co/150x150');

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <SearchBar />

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
                            <h1 className="featured-recipe__title">Title</h1>
                            <hr/>
                            <p id="description">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. At blanditiis dignissimos dolore dolorum eius eligendi error excepturi impedit ipsum laborum nemo placeat praesentium quia, quo repellat sit tenetur vitae voluptatem?Accusantium alias aliquid aperiam at atque aut deserunt doloremque earum ex iure laborum maiores, minima mollitia nemo nisi nobis numquam, quam quos sequi sint sit temporibus tenetur unde vero voluptatum?
                            </p>
                            <button className="read-more-button">Read more</button>
                        </div>

                    </div>


                </section>

                <section className="popular-recipes">
                    <PopularSlider images={placeholderImages} />
                </section>
            </main>
        </div>
    );
};

export default App;