const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
// const { authenticateToken, isAdmin, isManager } = require('../authentication/middleware');
const { secretKey } = require('../authentication/config');

const router = express.Router();

// add employee leave record
router.post('/add', async (req, res) => {
    try {
        const { name, start_date, end_date } = req.body;

        // validate input
        if (!name || !start_date || !end_date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // check if employee with the provided name exists
        const selectEmployeeQuery = 'SELECT wi.crew_id, pi.name, wi.working_information_id FROM working_information wi JOIN personal_information pi ON wi.personal_information_id = pi.personal_information_id WHERE pi.name = ?';
        const [employeeResult] = await db.promise().execute(selectEmployeeQuery, [name]);

        if (employeeResult.length === 0) {
            console.log(`Error: Employee not found. The provided Employee Name "${name}" does not exist in the database. Please verify the name and try again.`);
            return res.status(404).json({ error: `Employee not found. The provided Employee Name "${name}" does not exist in the database. Please verify the name and try again.` });
        }

        const crew_id = employeeResult[0].crew_id;
        const working_information_id = employeeResult[0].working_information_id;

        // set leave_status based on current date and end_date
        const currentDate = new Date().toISOString().split('T')[0]; // get current date in YYYY-MM-DD format

        let leave_status;
        if (currentDate >= start_date && currentDate <= end_date) {
            leave_status = 'Active';
        } else if (currentDate > end_date) {
            leave_status = 'Inactive';
        } else if (currentDate < start_date) {
            leave_status = 'Pending';
        }

        const creatorName = req.user.userId;

        // insert into employee_on_leave table
        const insertLeaveQuery = 'INSERT INTO employee_on_leave (working_information_id, start_date, end_date, leave_status, created_by) VALUES (?, ?, ?, ?, ?)';
        await db.promise().execute(insertLeaveQuery, [working_information_id, start_date, end_date, leave_status, creatorName]);

        res.status(201).json({ message: 'Employee leave record added successfully' });
    } catch (error) {
        console.error('Error adding employee leave record:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// retrieve all employee on leave
router.get('/all', async (req, res) => {
    try {
        const getAllLeavesQuery = `
            SELECT 
                eol.employee_on_leave_id,
                pi.name,
                wi.crew_id,
                DATE_FORMAT(eol.start_date, '%Y-%m-%d') AS start_date,
                DATE_FORMAT(eol.end_date, '%Y-%m-%d') AS end_date,
                eol.leave_status,
                u.name AS created_by
            FROM 
                employee_on_leave eol
            INNER JOIN 
                working_information wi ON eol.working_information_id = wi.working_information_id
            INNER JOIN 
                personal_information pi ON wi.personal_information_id = pi.personal_information_id
            LEFT JOIN 
                user u ON eol.created_by = u.user_id
        `;
        const [leaves] = await db.promise().execute(getAllLeavesQuery);
        res.status(200).json(leaves);
    } catch (error) {
        console.error('Error fetching leaves:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// retrieve specific employee on leave using crew_id
router.get('/:crew_id', async (req, res) => {
    try {
        const crew_id = req.params.crew_id;

        // Validate crew ID format
        const crewIDRegex = /^0300\d{6}$/;
        if (!crewIDRegex.test(crew_id)) {
            return res.status(400).json({ error: 'Invalid crew ID format' });
        }

        // Query to retrieve employee's leaves using crew_id
        const getEmployeeLeavesQuery = `
            SELECT 
                eol.employee_on_leave_id,
                pi.name,
                wi.crew_id,
                DATE_FORMAT(eol.start_date, '%Y-%m-%d') AS start_date,
                DATE_FORMAT(eol.end_date, '%Y-%m-%d') AS end_date,
                eol.leave_status,
                u.name AS created_by
            FROM 
                employee_on_leave eol
            INNER JOIN 
                working_information wi ON eol.working_information_id = wi.working_information_id
            INNER JOIN 
                personal_information pi ON wi.personal_information_id = pi.personal_information_id
            LEFT JOIN 
                user u ON eol.created_by = u.user_id
            WHERE 
                wi.crew_id = ?;
        `;
        const [employeeLeaves] = await db.promise().execute(getEmployeeLeavesQuery, [crew_id]);

        res.status(200).json(employeeLeaves);
    } catch (error) {
        console.error('Error fetching employee leaves:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// retrieve specific employee on leave using name
router.get('/name/:name', async (req, res) => {
    try {
        const name = req.params.name;

        // Query to retrieve employee's leaves using name
        const getEmployeeLeavesQuery = `
            SELECT 
                eol.employee_on_leave_id,
                pi.name,
                wi.crew_id,
                DATE_FORMAT(eol.start_date, '%Y-%m-%d') AS start_date,
                DATE_FORMAT(eol.end_date, '%Y-%m-%d') AS end_date,
                eol.leave_status,
                u.name AS created_by
            FROM 
                employee_on_leave eol
            INNER JOIN 
                working_information wi ON eol.working_information_id = wi.working_information_id
            INNER JOIN 
                personal_information pi ON wi.personal_information_id = pi.personal_information_id
            LEFT JOIN 
                user u ON eol.created_by = u.user_id
            WHERE 
                pi.name = ?;
        `;
        const [employeeLeaves] = await db.promise().execute(getEmployeeLeavesQuery, [name]);

        res.status(200).json(employeeLeaves);
    } catch (error) {
        console.error('Error fetching employee leaves:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// update employee leave record by name
router.put('/update/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const { start_date, end_date } = req.body;

        // validate input
        if (!start_date || !end_date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // check if employee with the provided name exists
        const selectEmployeeQuery = 'SELECT wi.crew_id, pi.name, wi.working_information_id FROM working_information wi JOIN personal_information pi ON wi.personal_information_id = pi.personal_information_id WHERE pi.name = ?';
        const [employeeResult] = await db.promise().execute(selectEmployeeQuery, [name]);

        if (employeeResult.length === 0) {
            return res.status(404).json({ error: `Employee not found. The provided Employee Name "${name}" does not exist in the database. Please verify the name and try again.` });
        }

        const working_information_id = employeeResult[0].working_information_id;

        // set leave_status based on current date and end_date
        const currentDate = new Date().toISOString().split('T')[0]; // get current date in YYYY-MM-DD format

        let leave_status;
        if (currentDate >= start_date && currentDate <= end_date) {
            leave_status = 'Active';
        } else if (currentDate > end_date) {
            leave_status = 'Inactive';
        } else if (currentDate < start_date) {
            leave_status = 'Pending';
        }

        const updaterName = req.user.userId;

        // update employee leave record
        const updateLeaveQuery = 'UPDATE employee_on_leave SET start_date=?, end_date=?, leave_status=?, created_by=? WHERE working_information_id=?';
        await db.promise().execute(updateLeaveQuery, [start_date, end_date, leave_status, updaterName, working_information_id]);

        res.status(200).json({ message: 'Employee leave record updated successfully' });
    } catch (error) {
        console.error('Error updating employee leave record:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




module.exports = router;
