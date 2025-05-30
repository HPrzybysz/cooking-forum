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
    images: RecipeImage[];
}

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