import { render, screen } from '@testing-library/react';
import SignUpPage from '../components/SignupPage';
import '@testing-library/jest-dom';

jest.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        register: jest.fn(),
        isLoading: false,
    }),
}));

describe('SignUpPage', () => {
    it('renders signup form', () => {
        render(
            <SignUpPage
                onClose={() => {}}
                switchToLogin={() => {}}
            />
        );

        expect(screen.getByText('Create Account')).toBeInTheDocument();
    });
});