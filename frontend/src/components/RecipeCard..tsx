import React from 'react';
import '../styles/RecipeCard.scss';
import {RecipeCardProps} from './types';

const RecipeCard: React.FC<RecipeCardProps> = ({title, image}) => {
    return (
        <div className="recipe-card">
            <div className="recipe-card__image">
                <img src={image} alt={title}/>
            </div>
            <h3 className="recipe-card__title">{title}</h3>
        </div>
    );
};

export default RecipeCard;