import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import UserAccountPage from "./components/UserAccountPage.tsx";
import CategoriesPage from './components/CategoriesPage';
import CategoryRecipesPage from './components/CategoryRecipesPage';
import RecipePage from './components/RecipePage';
import AddRecipePage from './components/AddRecipePage';
import PasswordResetRequest from './components/PasswordResetRequest';
import PasswordResetForm from './components/PasswordResetForm';
import AuthModal from './components/AuthModal.tsx';
import FavoritesPage from './components/FavoritesPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={
                <LoginPage
                    onClose={() => window.history.back()}
                    onLoginSuccess={() => window.history.back()}
                />
            }/>
            <Route path="/signup" element={
                <SignUpPage
                    onClose={() => window.history.back()}
                    switchToLogin={() => window.history.back()}
                    onSignupSuccess={() => window.history.back()}
                />
            }/>
            <Route path="/account" element={
                <ProtectedRoute>
                    <UserAccountPage/>
                </ProtectedRoute>
            }/>
            <Route path="/" element={
                <ProtectedRoute isPublic>
                    <HomePage/>
                </ProtectedRoute>
            }/>
            <Route path="/categories" element={<CategoriesPage/>}/>
            <Route path="/category/:categoryId" element={<CategoryRecipesPage/>}/>
            <Route path="/recipe/:id" element={<RecipePage/>}/>
            <Route path="/add-recipe" element={<ProtectedRoute><AddRecipePage/></ProtectedRoute>}/>
            <Route path="/reset-password" element={<PasswordResetRequest/>}/>
            <Route path="/reset-password/:token" element={<PasswordResetForm/>}/>
            <Route path="/favorites" element={<FavoritesPage/>}/>
        </Routes>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Header/>
                <AuthModal/>
                <AppRoutes/>
            </Router>
        </AuthProvider>
    );
};

export default App;