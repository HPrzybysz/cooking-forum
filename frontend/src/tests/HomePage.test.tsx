import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../components/HomePage';
import api from '../api';

jest.mock('../api');
jest.mock('../services/recipeImageService');
jest.mock('../utils/imageUtils');

const mockFeaturedRecipe = {
    id: 1,
    title: 'Test Recipe',
    description: 'Test description',
    prep_time: 30,
    servings: 4,
    author: {
        firstName: 'John',
        lastName: 'Doe'
    }
};

describe('HomePage', () => {
    beforeEach(() => {
        (api.get as jest.Mock).mockResolvedValue({
            data: [mockFeaturedRecipe]
        });
    });

    it('renders loading state initially', async () => {
        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        await waitFor(() => {});
    });

    it('renders featured recipe after loading', async () => {
        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Recipe of the day')).toBeInTheDocument();
            expect(screen.getByText('Test Recipe')).toBeInTheDocument();
            expect(screen.getByText('Read more')).toBeInTheDocument();
        });
    });

    it('shows error message when fetch fails', async () => {
        (api.get as jest.Mock).mockRejectedValue(new Error('API error'));

        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Failed to load featured recipe')).toBeInTheDocument();
        });
    });
});