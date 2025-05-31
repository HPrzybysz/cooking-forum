import React, { useState, useEffect } from 'react';
import { Rating, Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import api from '../api';
import { useAuth } from '../context/AuthContext';

interface RecipeRatingProps {
    recipeId: number;
    showAverage?: boolean;
    size?: 'small' | 'medium' | 'large';
}

interface RatingData {
    average: number;
    count: number;
    ratings: Array<{
        id: number;
        rating: number;
    }>;
}

const RecipeRating: React.FC<RecipeRatingProps> = ({ recipeId, showAverage = false, size = 'medium' }) => {
    const { user } = useAuth();
    const [userRating, setUserRating] = useState<number | null>(null);
    const [ratingData, setRatingData] = useState<RatingData>({
        average: 0,
        count: 0,
        ratings: []
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                if (user) {
                    const userRatingResponse = await api.get(`/api/recipes/${recipeId}/ratings/me`);
                    if (userRatingResponse.data && userRatingResponse.data.rating) {
                        setUserRating(userRatingResponse.data.rating);
                    }
                }

                const response = await api.get(`/api/recipes/${recipeId}/ratings`);
                setRatingData({
                    average: response.data.average || 0,
                    count: response.data.count || 0,
                    ratings: response.data.ratings || []
                });
            } catch (error) {
                console.error('Error fetching ratings:', error);
                setRatingData({
                    average: 0,
                    count: 0,
                    ratings: []
                });
            }
        };

        fetchRatings();
    }, [user, recipeId]);

    const handleRatingChange = async (newValue: number | null) => {
        if (!user || !newValue) return;
        setLoading(true);
        try {
            await api.post(`/api/recipes/${recipeId}/ratings`, { rating: newValue });
            setUserRating(newValue);

            const response = await api.get(`/api/recipes/${recipeId}/ratings`);
            setRatingData({
                average: response.data.average || 0,
                count: response.data.count || 0,
                ratings: response.data.ratings || []
            });
        } catch (error) {
            console.error('Error submitting rating:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" alignItems="center" gap={1}>
            <Rating
                name={`recipe-rating-${recipeId}`}
                value={userRating || ratingData.average || 0}
                onChange={(_, newValue) => handleRatingChange(newValue)}
                precision={0.5}
                readOnly={!user || loading}
                size={size}
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
            {showAverage && ratingData.count > 0 && (
                <Typography variant="body2" color="text.secondary">
                    ({ratingData.average.toFixed(1)} from {ratingData.count} {ratingData.count === 1 ? 'rating' : 'ratings'})
                </Typography>
            )}
        </Box>
    );
};

export default RecipeRating;