import api from '../api/index';

export interface RecipeImage {
    id: number;
    recipe_id: number;
    image_url: string | null;
    image_data?: {
        type: string;
        data: Uint8Array;
    };
    is_primary: boolean;
    created_at: string;
}

export const getRecipeImages = async (recipeId: string): Promise<RecipeImage[]> => {
    try {
        const response = await api.get(`/api/recipes/${recipeId}/images`);
        return response.data || [];
    } catch (error) {
        console.error('Error fetching recipe images:', error);
        return [];
    }
};