import api from '../api';

export const getRecipeRatings = async (recipeId: string) => {
    const response = await api.get(`/api/recipes/${recipeId}/ratings`);
    return response.data;
};

export const getUserRating = async (recipeId: string) => {
    const response = await api.get(`/api/recipes/${recipeId}/ratings/me`);
    return response.data;
};

export const submitRating = async (recipeId: string, rating: number) => {
    await api.post(`/api/recipes/${recipeId}/ratings`, { rating });
};

export const deleteRating = async (recipeId: string) => {
    await api.delete(`/api/recipes/${recipeId}/ratings`);
};
