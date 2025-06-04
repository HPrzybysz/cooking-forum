import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

jest.mock('../components/Header', () => () => <div data-testid="header">Header</div>);
jest.mock('../components/AuthModal', () => () => <div data-testid="auth-modal">AuthModal</div>);

jest.mock('../assets/logo.png', () => 'test-logo.png');

describe('App', () => {
    it('renders without crashing', () => {
        render(<App RouterComponent={MemoryRouter} />);
        expect(screen.getByTestId('header')).toBeInTheDocument();
    });
});