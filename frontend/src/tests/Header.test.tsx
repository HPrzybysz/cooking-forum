import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Header';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn()
}));

jest.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        user: null,
        logout: jest.fn(),
        isLoading: false
    })
}));

jest.mock('../assets/logo.png', () => 'test-logo.png');

describe('Header', () => {
    it('renders without crashing', () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );
        expect(screen.getByText('Home')).toBeInTheDocument();
    });
});