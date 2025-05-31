const db = require('../config/db');
const path = require('path');
const fs = require('fs');
const {v4: uuidv4} = require('uuid');

module.exports = {
    getProfile: async (req, res) => {
        try {
            const [rows] = await db.execute(
                'SELECT id, first_name, last_name, email, avatar_url FROM users WHERE id = ?',
                [req.userId]
            );
            res.json(rows[0]);
        } catch (error) {
            res.status(400).json({error: error.message});
        }
    },

    updateProfile: async (req, res) => {
        try {
            const {firstName, lastName, email} = req.body;
            await db.execute(
                'UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE id = ?',
                [firstName, lastName, email, req.userId]
            );
            const [user] = await db.execute(
                'SELECT id, first_name, last_name, email, avatar_url FROM users WHERE id = ?',
                [req.userId]
            );
            res.json(user[0]);
        } catch (error) {
            res.status(400).json({error: error.message});
        }
    },

    updateAvatar: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({error: 'No file uploaded'});
            }

            const fileExt = path.extname(req.file.originalname);
            const fileName = `${uuidv4()}${fileExt}`;
            const uploadPath = path.join(__dirname, '../../uploads', fileName);

            if (!fs.existsSync(path.dirname(uploadPath))) {
                fs.mkdirSync(path.dirname(uploadPath), {recursive: true});
            }

            fs.writeFileSync(uploadPath, req.file.buffer);

            await db.execute(
                'UPDATE users SET avatar_url = ? WHERE id = ?',
                [fileName, req.userId]
            );

            const [user] = await db.execute(
                'SELECT id, first_name, last_name, email, avatar_url FROM users WHERE id = ?',
                [req.userId]
            );

            res.json({
                avatarUrl: `/uploads/${fileName}`
            });
        } catch (error) {
            res.status(400).json({error: error.message});
        }
    },

    getUserRecipes: async (req, res) => {
        try {
            const [rows] = await db.execute(
                `SELECT r.id, r.title, ri.image_url as imageUrl 
         FROM recipes r
         LEFT JOIN recipe_images ri ON r.id = ri.recipe_id AND ri.is_primary = 1
         WHERE r.user_id = ?`,
                [req.userId]
            );
            res.json(rows);
        } catch (error) {
            res.status(400).json({error: error.message});
        }
    }
};