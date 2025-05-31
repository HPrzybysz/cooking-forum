import React, {useState, useEffect} from 'react';
import {IconButton} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import api from '../api';
import {useAuth} from '../context/AuthContext';

interface FavoriteButtonProps {
    recipeId: number;
    size?: 'small' | 'medium' | 'large';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({recipeId, size = 'medium'}) => {
    const {user} = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            if (!user) return;
            try {
                const response = await api.get(`/api/recipes/${recipeId}/favorite`);
                setIsFavorite(response.data.isFavorite);
            } catch (error) {
                console.error('Error checking favorite status:', error);
            }
        };

        checkFavoriteStatus();
    }, [user, recipeId]);

    const toggleFavorite = async () => {
        if (!user) return;
        setLoading(true);
        try {
            if (isFavorite) {
                await api.delete(`/api/recipes/${recipeId}/favorite`);
            } else {
                await api.post(`/api/recipes/${recipeId}/favorite`);
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <IconButton
            onClick={toggleFavorite}
            disabled={loading || !user}
            size={size}
            color={isFavorite ? 'error' : 'default'}
        >
            {isFavorite ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
        </IconButton>
    );
};

export default FavoriteButton;