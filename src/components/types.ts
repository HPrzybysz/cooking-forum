export interface RecipeCardProps {
    title: string;
    image: string;
}

export interface Recipe {
    id: string;
    title: string;
    imageUrl: string;
    prepTime: number;
    ingredients: string[];
    instructions: string[];
    author: {
        name: string;
        avatarUrl?: string;
    };
    tags: string[];
}