const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const { authenticateToken, isAdmin, isManager } = require('../authentication/middleware');
// require('dotenv').config();

const router = express.Router();

// register User
router.post('/register', async (req, res) => {
    try {
        const { name, id_number, password, role_id} = req.body;
        const creator_id = req.user.userId;
        const is_active = 1;

        // validate input
        if (!name || !id_number || !password || !role_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // ID number format validation
        const idNumberRegex = /^0300\d{6}$/;
        if (!idNumberRegex.test(id_number)) {
            return res.status(400).json({ error: 'ID number must be 10 digits long without spaces and start with "0300" (e.g., 0300345678)' });
        }

        // password strength validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: 'Password must be 8-15 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character' });
        }

        // check if user with the same name or ID number already exists
        const checkUserByNameQuery = 'SELECT * FROM user WHERE name = ?';
        const [existingUserByNameRows] = await db.promise().execute(checkUserByNameQuery, [name]);

        if (existingUserByNameRows.length > 0) {
            return res.status(409).json({ error: 'User with this name already exists' });
        }

        const checkUserByIdQuery = 'SELECT * FROM user WHERE id_number = ?';
        const [existingUserByIdRows] = await db.promise().execute(checkUserByIdQuery, [id_number]);

        if (existingUserByIdRows.length > 0) {
            return res.status(409).json({ error: 'User with this ID number already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertUserQuery = 'INSERT INTO user(name, id_number, password, is_active, role_id, created_by) VALUES (?, ?, ?, ?, ?, ?)';
        await db.promise().execute(insertUserQuery, [name, id_number, hashedPassword, is_active, role_id, creator_id]);
        console.log('is_active:', is_active);
        console.log('role_id', role_id);
        res.status(201).json({ message: 'User Registered Successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// ----USER DATA----

// retrieve all users
router.get('/all', async(req, res) =>{
    try {
        const getAllUsersQuery = `
            SELECT u.user_id, u.id_number, u.name, u.role_id, r.role_name, 
                   IF(u.is_active, 1, 0) AS is_active,
                   c.user_id AS creator_id, c.name AS creator_name
            FROM user u
            JOIN role r ON u.role_id = r.role_id
            LEFT JOIN user c ON u.created_by = c.user_id`;
        const [rows] = await db.promise().execute(getAllUsersQuery);

        res.status(200).json({ users: rows });
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// retrieve user by id_number
router.get('/:id_number', async (req, res) => {
    let id_number = req.params.id_number;

    if (!id_number) {
        return res.status(400).send({ error: true, message: 'Please provide user id number' });
    }

    try {
        const getUserByIdNumberQuery = `
            SELECT u.user_id, u.id_number, u.name, u.role_id, r.role_name,
                   IF(u.is_active, 1, 0) AS is_active,
                   c.user_id AS creator_id, c.name AS creator_name
            FROM user u
            JOIN role r ON u.role_id = r.role_id
            LEFT JOIN user c ON u.created_by = c.user_id
            WHERE u.id_number = ?`;

        const [result] = await db.promise().execute(getUserByIdNumberQuery, [id_number]);

        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user: result[0] });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// retrieve user by name
router.get('/name/search', async (req, res) => {
    let { name } = req.query;

    if (!name) {
        return res.status(400).json({ error: 'Please provide a name to search' });
    }

    // decode the query parameter
    name = decodeURIComponent(name);
    name = name.replace(/%20/g, ' ');

    try {
        const searchUserByNameQuery = `
            SELECT u.user_id, u.id_number, u.name, u.role_id, r.role_name,
                   IF(u.is_active, 1, 0) AS is_active,
                   c.user_id AS creator_id, c.name AS creator_name
            FROM user u
            JOIN role r ON u.role_id = r.role_id
            LEFT JOIN user c ON u.created_by = c.user_id
            WHERE u.name LIKE ?`;
        
        const [searchedUsers] = await db.promise().execute(searchUserByNameQuery, [`%${name}%`]);

        if (searchedUsers.length === 0) {
            return res.status(404).json({ error: 'No users found with the provided name' });
        }

        res.status(200).json({ users: searchedUsers });
    } catch (error) {
        console.error('Error searching users by name:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// update user by id
router.put('/:user_id', async (req, res) =>{
    try{
        const userId = req.params.user_id;
        const { id_number, name, password, is_active } = req.body;

        if (is_active !== 0 && is_active !== 1) {
            return res.status(400).json({ error: 'Invalid value for is_active. (Accepted values: 0 for inactive and 1 for active).' });
        }

        const getUserQuery = 'SELECT u.user_id, u.id_number, u.name, u.role_id, u.password AS stored_password, r.role_name FROM user u JOIN role r ON u.role_id = r.role_id WHERE u.user_id = ?';
        const [userRows] = await db.promise().execute(getUserQuery, [userId]);

        if(userRows.length === 0){
            return res.status(404).json({error: 'User not found'});
        }

        const user = userRows[0];

        // only allow modification of password by the owner
        if (password !== undefined && req.user.id_number !== user.id_number) {
            return res.status(403).json({ error: 'You are not authorized to modify this user\'s password.' });
        }

        // ID number format validation
        const idNumberRegex = /^0300\d{6}$/;
        if (id_number && !idNumberRegex.test(id_number)) {
            return res.status(400).json({ error: 'ID number must be 10 digits long without spaces and start with "0300" (e.g., 0300345678)' });
        }

        // password strength validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
        if (password && !passwordRegex.test(password)) {
            return res.status(400).json({ error: 'Password must be 8-15 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character' });
        }

        // only hash the password if it's being modified
        let hashedPassword = user.stored_password;
        if (password !== undefined) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const updated_by = req.user.userId;

        const updateUserQuery = 'UPDATE user SET id_number = ?, name = ?, password = ?, is_active = ?, created_by = ? WHERE user_id = ?';
        await db.promise().execute(updateUserQuery, [id_number, name, hashedPassword, is_active, updated_by, userId]);

        const updatedUser = { user_id: user.user_id, id_number, name, role_id: user.role_id, role_name: user.role_name, is_active};
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch(error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;