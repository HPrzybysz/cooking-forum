import api from '../api';
import {Recipe} from '../components/types';

export const getPopularRecipes = async (limit: number = 10): Promise<Recipe[]> => {
    try {
        const response = await api.get(`/api/stats/popular?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching popular recipes:', error);
        throw error;
    }
};