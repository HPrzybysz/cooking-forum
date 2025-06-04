import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CategoriesPage from '../components/CategoriesPage';
import { getCategories } from '../services/categoryService';

jest.mock('../services/categoryService');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

const mockCategories = [
    { id: '1', name: 'Category 1', imageUrl: '' },
    { id: '2', name: 'Category 2', imageUrl: '' }
];

describe('CategoriesPage', () => {
    beforeEach(() => {
        (getCategories as jest.Mock).mockResolvedValue(mockCategories);
    });

    it('renders loading state initially', async () => {
        render(
            <MemoryRouter>
                <CategoriesPage />
            </MemoryRouter>
        );
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        await waitFor(() => {});
    });

    it('renders categories after loading', async () => {
        render(
            <MemoryRouter>
                <CategoriesPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Recipe Categories')).toBeInTheDocument();
            expect(screen.getByText('Category 1')).toBeInTheDocument();
            expect(screen.getByText('Category 2')).toBeInTheDocument();
        });
    });

    it('calls navigate on category click', async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

        render(
            <MemoryRouter>
                <CategoriesPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            fireEvent.click(screen.getByText('Category 1'));
            expect(mockNavigate).toHaveBeenCalledWith('/category/1');
        });
    });
});