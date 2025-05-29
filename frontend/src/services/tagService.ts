import api from '../api/index';

export interface Tag {
    id: number;
    name: string;
}

export const getTags = async (): Promise<Tag[]> => {
    const response = await api.get('/api/tags');
    return response.data;
};

export const createTag = async (name: string): Promise<Tag> => {
    const response = await api.post('/api/tags', {name});
    return response.data;
};