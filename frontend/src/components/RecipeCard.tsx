import React, {useEffect, useState} from 'react';
import '../styles/RecipeCard.scss';
import FavoriteButton from './FavoriteButton';
import RecipeRating from './RecipeRating';
import {getRecipeImages} from '../services/recipeImageService';
import {RecipeImage} from '../services/recipeImageService';

interface RecipeCardProps {
    recipeId: number;
    title: string;
    showFavoriteButton?: boolean;
    showRating?: boolean;
    onClick?: () => void;
    statistics?: {
        favorite_count?: number;
    };
}

const RecipeCard: React.FC<RecipeCardProps> = ({
                                                   recipeId,
                                                   title,
                                                   showFavoriteButton = true,
                                                   showRating = true,
                                                   onClick,
                                                   statistics
                                               }) => {
    const [images, setImages] = useState<RecipeImage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const fetchedImages = await getRecipeImages(recipeId.toString());
                setImages(fetchedImages);
            } catch (error) {
                console.error('Error fetching images:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [recipeId]);

    const primaryImage = images.find(img => img.is_primary) || images[0];

    const getImageUrl = (image?: RecipeImage): string => {
        if (!image) return 'https://placehold.co/600x400?text=No+Image';

        if (image.image_data) {
            const base64String = btoa(
                String.fromCharCode(...new Uint8Array(image.image_data.data))
            );
            return `data:image/jpeg;base64,${base64String}`;
        }

        return image.image_url || 'https://placehold.co/600x400?text=No+Image';
    };


    if (loading) {
        return (
            <div className="recipe-card">
                <div className="recipe-card__image-container">
                    <div className="image-placeholder"/>
                </div>
                <div className="recipe-card__content">
                    <h3 className="recipe-card__title">{title}</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="recipe-card" onClick={onClick}>
            <div className="recipe-card__image-container">
                <img
                    src={getImageUrl(primaryImage)}
                    alt={title}
                    className="recipe-card__image"
                    loading="lazy"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Error';
                    }}
                />
            </div>

            <div className="recipe-card__content">
                <h3 className="recipe-card__title">{title}</h3>

                {showRating && (
                    <div className="recipe-card__rating">
                        <RecipeRating recipeId={recipeId} size="small"/>
                    </div>
                )}

                {showFavoriteButton && (
                    <div className="recipe-card__favorite">
                        <FavoriteButton recipeId={recipeId} size="small"/>
                        {statistics?.favorite_count !== undefined && (
                            <span className="favorite-count">
                                {statistics.favorite_count}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecipeCard;