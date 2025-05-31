import api from '../api';

export const getUserFavorites = async () => {
    const response = await api.get('/api/user/favorites');
    return response.data;
};

export const addFavorite = async (recipeId: number) => {
    await api.post(`/api/recipes/${recipeId}/favorite`);
};

export const removeFavorite = async (recipeId: number) => {
    await api.delete(`/api/recipes/${recipeId}/favorite`);
};

export const checkFavorite = async (recipeId: number) => {
    const response = await api.get(`/api/recipes/${recipeId}/favorite`);
    return response.data.isFavorite;
};