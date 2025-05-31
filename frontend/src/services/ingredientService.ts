import api from '../api/index';

export interface Ingredient {
    id: number;
    name: string;
    amount: string;
}

export const getRecipeIngredients = async (recipeId: string): Promise<Ingredient[]> => {
    const response = await api.get(`/api/recipes/${recipeId}/ingredients`);
    return response.data;
};