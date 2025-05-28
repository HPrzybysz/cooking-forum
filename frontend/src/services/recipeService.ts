import api from '../api/index';

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

        if (recipeData.ingredients.length > 0) {
            await api.post(`/recipes/${recipeId}/ingredients`, {
                ingredients: recipeData.ingredients
            });
        }

        if (recipeData.steps.length > 0) {
            await api.post(`/recipes/${recipeId}/steps`, {
                steps: recipeData.steps
            });
        }

        if (recipeData.tags.length > 0) {
            await api.post(`/recipes/${recipeId}/tags`, {
                tags: recipeData.tags
            });
        }

        return { ...recipeResponse.data, recipeId };
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