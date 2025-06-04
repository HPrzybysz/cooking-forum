import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PasswordResetForm from '../components/PasswordResetForm';
import api from '../api';

jest.mock('../api');

describe('PasswordResetForm', () => {
    const renderComponent = () => {
        return render(
            <MemoryRouter initialEntries={['/reset-password/test-token']}>
                <Routes>
                    <Route path="/reset-password/:token" element={<PasswordResetForm />} />
                </Routes>
            </MemoryRouter>
        );
    };

    it('renders the form correctly', () => {
        renderComponent();

        expect(screen.getByRole('heading', { name: /set new password/i })).toBeInTheDocument();

        const passwordFields = screen.getAllByLabelText(/password/i, { selector: 'input' });
        expect(passwordFields.length).toBe(2);

        expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
    });

    it('shows error when passwords dont match', async () => {
        renderComponent();

        const passwordInputs = screen.getAllByLabelText(/password/i, { selector: 'input' });

        fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
        fireEvent.change(passwordInputs[1], { target: { value: 'different' } });
        fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

        await waitFor(() => {
            expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
        });
    });

    it('submits successfully when passwords match', async () => {
        (api.post as jest.Mock).mockResolvedValue({});
        renderComponent();

        const passwordInputs = screen.getAllByLabelText(/password/i, { selector: 'input' });

        fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
        fireEvent.change(passwordInputs[1], { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

        await waitFor(() => {
            expect(screen.getByText(/password reset successfully/i)).toBeInTheDocument();
        });
    });
});