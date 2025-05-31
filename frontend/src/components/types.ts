export interface Recipe {
    id: number;
    title: string;
    description: string;
    prep_time: number;
    servings: number;
    created_at: string;
    author: {
        name: string;
        avatarUrl?: string;
    };
    tags: string[];
    images?: RecipeImage[];
    statistics?: {
        favorite_count?: number;
        view_count?: number;
    };
}

export interface RecipeImage {
    id: number;
    recipe_id: number;
    image_url: string | null;
    image_data?: {
        type: string;
        data: Uint8Array | number[];
    };
    is_primary?: boolean;
    created_at?: string;
}
export interface RecipeStatistics {
    view_count: number;
    favorite_count: number;
    last_viewed: string;
}
export interface RatingData {
    average: number;
    count: number;
    ratings: Array<{
        id: number;
        user_id: number;
        recipe_id: number;
        rating: number;
        review?: string;
        created_at: string;
        updated_at: string;
        first_name?: string;
        last_name?: string;
    }>;
}