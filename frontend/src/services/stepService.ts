import api from '../api/index';

export interface Step {
    id: number;
    step_number: number;
    instruction: string;
}

export const getRecipeSteps = async (recipeId: string): Promise<Step[]> => {
    const response = await api.get(`/api/recipes/${recipeId}/steps`);
    return response.data;
};