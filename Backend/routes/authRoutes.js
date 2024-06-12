const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const { authenticateToken, isAdmin, isManager } = require('../authentication/middleware');
require('dotenv').config();

const router = express.Router();

// login
router.post('/login', async (req, res) => {
    try {
        const { id_number, password } = req.body;

        const getUserQuery = 'SELECT * FROM user WHERE id_number = ?';
        const [rows] = await db.promise().execute(getUserQuery, [id_number]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid ID number or password' });
        }
        const user = rows[0];

        if (user.is_active !== 1) {
            return res.status(403).json({ error: 'User is not active' });
        }
        
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid ID number or password' });
        }

        const token = jwt.sign({ userId: user.user_id, id_number: user.id_number, name: user.name, roleId: user.role_id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ token, userId: user.user_id });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
