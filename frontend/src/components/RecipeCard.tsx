import React from 'react';
import '../styles/RecipeCard.scss';

interface RecipeCardProps {
    title: string;
    image: string;
    onClick: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ title, image, onClick }) => {
    return (
        <div className="recipe-card" onClick={onClick}>
            <div className="recipe-card__image">
                <img
                    src={image}
                    alt={title}
                    loading="lazy"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Not+Found';
                    }}
                />
            </div>
            <h3 className="recipe-card__title">{title}</h3>
        </div>
    );
};

export default RecipeCard;