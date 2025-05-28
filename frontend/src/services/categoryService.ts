import api from '../api/index';

export const getCategories = async () => {
    const response = await api.get('/api/categories');
    return response.data;
};

export const getRecipesByCategory = async (categoryId: string) => {
    const response = await api.get(`/api/categories/${categoryId}/recipes`);
    return response.data;
};