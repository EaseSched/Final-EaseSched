const fs = require('fs');
const csv = require('csv-parser');
const db = require('../database/db');

const importEmployeeLeaveCSV = async (req, res) => {
    try {
        
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded or file is not in CSV format' });
        }
        
        const csvFilePath = req.file.path;
        const newcsvFilePath = './uploads/' + csvFilePath.replace('uploads\\', '');
        console.log(newcsvFilePath);


        const currentDate = new Date().toISOString().split('T')[0]; // get current date in YYYY-MM-DD format

        fs.createReadStream(newcsvFilePath)
            .pipe(csv())
            .on('data', async (row) => {
                try {
                    const Name = row['EMPLOYEE NAME'];
                    const startDate = row['START DATE\n(YYYY-MM-DD)'];
                    const endDate = row['END DATE\n(YYYY-MM-DD)'];

                    // check if row is empty
                    if (!Name && !startDate && !endDate) {
                        console.log('Warning: Emmpty row detected. Skipping.')
                        return;
                    }

                    // validate input
                    if (!Name || !startDate || !endDate) {
                        console.log(`Error: Missing required fields for employee ${Name}. Skipping.`);
                        return;
                    }

                    // check if employee with the provided name exists
                    const selectEmployeeQuery = 'SELECT wi.working_information_id FROM working_information wi JOIN personal_information pi ON wi.personal_information_id = pi.personal_information_id WHERE pi.name = ?';
                    const [employeeResult] = await db.promise().execute(selectEmployeeQuery, [Name]);

                    if (employeeResult.length === 0) {
                        console.log(`Error: Employee ${Name} not found in the database. Skipping.`);
                        return;
                    }

                    const working_information_id = employeeResult[0].working_information_id;

                    // set leave_status based on current date and end_date
                    let leaveStatus;
                    if (currentDate >= startDate && currentDate <= endDate) {
                        leaveStatus = 'Active';
                    } else if (currentDate > endDate) {
                        leaveStatus = 'Inactive';
                    } else if (currentDate < startDate) {
                        leaveStatus = 'Pending';
                    }

                    // insert into employee_on_leave table
                    const insertLeaveQuery = 'INSERT INTO employee_on_leave (working_information_id, start_date, end_date, leave_status, created_by) VALUES (?, ?, ?, ?, ?)';
                    await db.promise().execute(insertLeaveQuery, [working_information_id, startDate, endDate, leaveStatus, req.user.userId]);
                } catch (error) {
                    console.error('Error processing CSV row:', error);
                }
            })
            .on('end', () => {
                console.log('Employee leave CSV import completed');
                res.status(200).json({ message: 'Employee leave CSV import completed' });
            });
    } catch (error) {
        console.error('Error importing employee leave CSV:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { importEmployeeLeaveCSV };
