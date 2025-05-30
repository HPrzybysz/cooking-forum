import api from '../api/index';
import {Recipe} from "../components/types.ts";

interface RecipePayload {
    title: string;
    description: string;
    prep_time: number | null;
    servings: number | null;
    equipment: string | null;
    author_note: string | null;
    category_id: number | null;
    user_id: number;
}

interface IngredientPayload {
    name: string;
    amount: string;
}

interface StepPayload {
    step_number: number;
    instruction: string;
}

export const createRecipe = async (
    recipeData: Omit<RecipePayload, 'user_id'> & {
        ingredients: IngredientPayload[];
        steps: StepPayload[];
        tags: string[];
    },
    userId: number
) => {
    try {
        const recipeResponse = await api.post('/api/recipes', {
            ...recipeData,
            user_id: userId
        });
        const recipeId = recipeResponse.data.recipeId;

        await api.post(`/api/recipes/${recipeId}/components`, {
            ingredients: recipeData.ingredients,
            steps: recipeData.steps,
            tags: recipeData.tags
        });

        return {...recipeResponse.data, recipeId};
    } catch (error) {
        console.error('Error creating recipe:', error);
        throw error;
    }
};

export const getRecipe = async (id: string) => {
    const response = await api.get(`/api/recipes/${id}`);
    return response.data;
};

export const getPopularRecipes = async () => {
    const response = await api.get('/api/recipes/popular');
    return response.data;
};

export const getRecipesByUser = async (): Promise<Recipe[]> => {
    const response = await api.get('/api/recipes/user/me');
    return response.data as Recipe[];
};