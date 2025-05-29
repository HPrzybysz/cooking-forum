import api from '../api/index';

export interface RecipeImage {
    id: number;
    imageUrl: string;
    isPrimary: boolean;
}

export const getRecipeImages = async (recipeId: string): Promise<RecipeImage[]> => {
    const response = await api.get(`/api/recipes/${recipeId}/images`);
    return response.data;
};