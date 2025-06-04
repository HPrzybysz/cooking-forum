import { render, screen } from '@testing-library/react';
import LoginPage from '../components/LoginPage';

jest.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        login: jest.fn(),
        isLoading: false,
    }),
}));

jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
}));

jest.mock('../components/SignupPage', () => () => <div>SignUp Mock</div>);

describe('LoginPage', () => {
    it('renders login form', () => {
        render(
            <LoginPage
                onClose={() => {}}
                onLoginSuccess={() => {}}
            />
        );

        expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });
});