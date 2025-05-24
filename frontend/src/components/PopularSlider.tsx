import React, {useState, useEffect, useRef} from 'react';
import '../styles/PopularSlider.scss';
import RecipeCard from "./RecipeCard..tsx";


interface RecipeSliderProps {
    images: string[];
}

const RecipeSlider: React.FC<RecipeSliderProps> = ({images}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);

    const duplicatedImages = [...images, ...images, ...images];

    const goToPrev = () => {
        setCurrentIndex(prev => {
            const newIndex = prev - 1;
            if (newIndex < 0) {
                return images.length - 1;
            }
            return newIndex;
        });
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 3000);
    };

    const goToNext = () => {
        setCurrentIndex(prev => {
            const newIndex = prev + 1;
            if (newIndex >= images.length * 2) {
                return images.length;
            }
            return newIndex;
        });
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 3000);
    };

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            goToNext();
        }, 3000);

        return () => clearInterval(interval);
    }, [isPaused]);

    const translateX = -currentIndex * (100 / 3);

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

                <div
                    className="recipe-slider"
                    ref={sliderRef}
                    style={{transform: `translateX(${translateX}%)`}}
                >
                    {duplicatedImages.map((img, index) => (
                        <RecipeCard
                            key={`${index}-${img}`}
                            image={img}
                            title={`Popular ${(index % images.length) + 1}`}
                        />
                    ))}
                </div>

                <button className="slider-arrow right-arrow" onClick={goToNext}>
                    &#10095;
                </button>
            </div>
        </section>
    );
};

export default RecipeSlider;