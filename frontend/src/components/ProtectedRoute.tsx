import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

interface ProtectedRouteProps {
    children?: React.ReactNode;
    isPublic?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                           children,
                                                           isPublic = false
                                                       }) => {
    const {user, isLoading} = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isPublic) {
        return children ? <>{children}</> : <Outlet/>;
    }

    if (!user) {
        return <Navigate to="/" replace/>;
    }

    return children ? <>{children}</> : <Outlet/>;
};

export default ProtectedRoute;