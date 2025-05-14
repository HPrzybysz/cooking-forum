import React from 'react';
import {Box, Typography, Paper} from '@mui/material';
import '../styles/FavoritesPage.scss';

const FavoritesPage: React.FC = () => {
    return (
        <Box className="favorites-page">
            <Typography variant="h3" component="h1" className="page-title">
                My Favorites
            </Typography>
            <Paper elevation={3} className="content-paper">
                <Typography variant="body1">
                    Your favorite recipes will appear here.
                </Typography>
                {/*TODD Add favorite recipes list when connected to DB */}
            </Paper>
        </Box>
    );
};

export default FavoritesPage;