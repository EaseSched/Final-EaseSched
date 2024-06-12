const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
// const { authenticateToken, isAdmin, isManager } = require('../authentication/middleware');
const { secretKey } = require('../authentication/config');

const router = express.Router();
    
// add employee
router.post('/add', async (req, res) => {
    try {
        const { poscod, crew_id, name, hired_date, availability, status, stations, job_status } = req.body;
        const creatorName = req.user.userId;

        // validate input
        if (!poscod || !name || !crew_id || !hired_date || !availability || !stations || !job_status) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // validate POSCOD input
        if (poscod !== 'CRE' && poscod !== 'CT') {
            return res.status(400).json({ error: 'Invalid poscod. Only "CRE" for Crew and "CT" for Crew Training are allowed.' });
        }

        // crew ID number format validation
        const crewIDRegex = /^0300\d{6}$/;
        if (!crewIDRegex.test(crew_id)) {
            return res.status(400).json({ error: 'ID number must be 10 digits long without spaces and start with "0300" (e.g., 0300345678)' });
        }

        // parse the hired_date string and format it as MM-DD-YYYY
        const parsedDate = new Date(hired_date);
        const formattedDate = `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}-${parsedDate.getDate().toString().padStart(2, '0')}`;

        // check for duplicate name
        const duplicateNameQuery = 'SELECT COUNT(*) as count FROM personal_information WHERE name = ?';
        const [duplicateNameResult] = await db.promise().execute(duplicateNameQuery, [name]);

        const duplicateNameCount = duplicateNameResult[0].count;
        if (duplicateNameCount > 0) {
            return res.status(400).json({ error: 'Employee name already exists' });
        }

        // check for duplicate crew id
        const checkDuplicateQuery = 'SELECT COUNT(*) as count FROM working_information WHERE crew_id = ?';
        const [duplicateCheckResult] = await db.promise().execute(checkDuplicateQuery, [crew_id]);

        const duplicateCount = duplicateCheckResult[0].count;
        if (duplicateCount > 0) {
            return res.status(400).json({ error: 'Identification number already in use' });
        }

        // insert into personal_information table to get personal_information_id
        const insertPersonalInfoQuery = 'INSERT INTO personal_information (name) VALUES (?)';
        const [personalInfoResult] = await db.promise().execute(insertPersonalInfoQuery, [name]);
        const personalInformationId = personalInfoResult.insertId;

        // insert into working_information table
        const insertWorkingInfoQuery = `
            INSERT INTO working_information (personal_information_id, hired_date, crew_id, poscod, status, job_status, created_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [workingInfoResult] = await db.promise().execute(insertWorkingInfoQuery, [personalInformationId, formattedDate, crew_id, poscod, 'active', job_status, creatorName ]);
        const workingInformationId = workingInfoResult.insertId;

        // insert stations into employee_station_assignment table
        for (const station_name of stations) {
            // retrieve station_id based on station_name
            const selectStationIdQuery = 'SELECT station_id FROM station WHERE station_name = ?';
            const [stationIdResult] = await db.promise().execute(selectStationIdQuery, [station_name]);

            if (stationIdResult.length === 0) {
                return res.status(404).json({ error: 'Station not found' });
            }

            const station_id = stationIdResult[0].station_id;

            // insert into employee_station_assignment table
            const insertAssignmentQuery = `
                INSERT INTO employee_station_assignment (working_information_id, station_id) 
                VALUES (?, ?)`;
            await db.promise().execute(insertAssignmentQuery, [workingInformationId, station_id]);
        }

        // insert availability for each day
        for (const dayInfo of availability) {
            const { day_name, shifts } = dayInfo;

            // retrieve day_id based on day_name
            const selectDayIdQuery = 'SELECT day_id FROM day WHERE day_name = ?';
            const [dayIdResult] = await db.promise().execute(selectDayIdQuery, [day_name]);
            const dayId = dayIdResult[0].day_id;

            // insert into shift_availability table using working_information_id and day_id
            const insertShiftAvailabilityQuery = `
                INSERT INTO shift_availability (working_information_id, day_id, shifts)
                VALUES (?, ?, ?)`;
            await db.promise().execute(insertShiftAvailabilityQuery, [workingInformationId, dayId, JSON.stringify(shifts)]);
        }

        res.status(201).json({ message: 'Employee added successfully' });
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// retrieve all employees

/*  
    /all will return all employees.
    /all?status=active will return only active employees.
    /all?status=inactive will return only inactive employees. 
*/
router.get('/all', async (req, res) => {
    try {
        const filterStatus = req.query.status;
        let selectAllEmployeesQuery = `
            SELECT
                pi.personal_information_id,
                pi.name AS person_name,
                wi.working_information_id,
                u.name AS creator_name,
                wa.area_id,
                a.area_name,
                wi.hired_date,
                wi.status,
                wi.job_status,
                wi.crew_id,
                wi.poscod,
                GROUP_CONCAT(sa.day_id) AS day_ids,
                GROUP_CONCAT(sa.shifts SEPARATOR ';') AS shifts_json
            FROM personal_information pi
            JOIN working_information wi ON pi.personal_information_id = wi.personal_information_id
            LEFT JOIN shift_availability sa ON wi.working_information_id = sa.working_information_id
            LEFT JOIN working_area wa ON wi.working_information_id = wa.working_information_id
            LEFT JOIN area a ON wa.area_id = a.area_id
            LEFT JOIN user u ON wi.created_by = u.user_id
        `;
        
        if (filterStatus) {
            selectAllEmployeesQuery += `
                WHERE wi.status = '${filterStatus}'
            `;
        }

        selectAllEmployeesQuery += 'GROUP BY wi.working_information_id, pi.personal_information_id';
        const [allEmployees] = await db.promise().execute(selectAllEmployeesQuery);

        const formattedEmployees = [];

        for (const employee of allEmployees) {
            const availability = {
                sunday: [],
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: []
            };

            if (employee.day_ids && employee.shifts_json) {
                const dayIds = employee.day_ids.split(',');
                const shiftsJson = employee.shifts_json.split(';');

                dayIds.forEach((dayId, index) => {
                    const dayName = mapDayIdToName(parseInt(dayId)); // Ensure dayId is parsed as an integer
                    if (dayName) {
                        if (shiftsJson[index]) {
                            const parsedShifts = JSON.parse(shiftsJson[index]);
                            parsedShifts.forEach(shift => {
                                availability[dayName].push({
                                    shift_start: shift.shift_start,
                                    shift_end: shift.shift_end
                                });
                            });
                        }
                    } else {
                        console.error('Invalid day id:', dayId);
                    }
                });
            }

            const selectStationsQuery = `
                SELECT station.station_name
                FROM station
                INNER JOIN employee_station_assignment ON station.station_id = employee_station_assignment.station_id
                INNER JOIN working_information ON employee_station_assignment.working_information_id = working_information.working_information_id
                WHERE working_information.working_information_id = ?`;

            const [stations] = await db.promise().execute(selectStationsQuery, [employee.working_information_id]);

            const formattedEmployee = {
                name: employee.person_name,
                crew_id: employee.crew_id,
                poscod: employee.poscod,
                hired_date: employee.hired_date,
                status: employee.status,
                job_status: employee.job_status,
                created_by: employee.creator_name,
                availability: availability,
                stations_assigned: stations.map(station => station.station_name)
            };

            formattedEmployees.push(formattedEmployee);
        }

        res.status(200).json(formattedEmployees);
    } catch (error) {
        console.error('Error retrieving all employees:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// retrieve employees by crew_id
router.get('/:crew_id', async (req, res) => {
    try {
        const crewId = req.params.crew_id;

        const selectEmployeeQuery = `
            SELECT
                pi.personal_information_id,
                pi.name AS person_name,
                wi.working_information_id,
                u.name AS creator_name,
                wa.area_id,
                a.area_name,
                wi.hired_date,
                wi.status,
                wi.job_status,
                wi.crew_id,
                wi.poscod,
                GROUP_CONCAT(sa.day_id) AS day_ids,
                GROUP_CONCAT(sa.shifts SEPARATOR ';') AS shifts_json
            FROM personal_information pi
            JOIN working_information wi ON pi.personal_information_id = wi.personal_information_id
            LEFT JOIN shift_availability sa ON wi.working_information_id = sa.working_information_id
            LEFT JOIN working_area wa ON wi.working_information_id = wa.working_information_id
            LEFT JOIN area a ON wa.area_id = a.area_id
            LEFT JOIN user u ON wi.created_by = u.user_id
            WHERE wi.crew_id = ?
            GROUP BY wi.working_information_id, pi.personal_information_id`;

        const [employeeData] = await db.promise().execute(selectEmployeeQuery, [crewId]);

        if (employeeData.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const employee = employeeData[0];

        const availability = {
            sunday: [],
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: []
        };

        if (employee.day_ids && employee.shifts_json) {
            const dayIds = employee.day_ids.split(',');
            const shiftsJson = employee.shifts_json.split(';');

            dayIds.forEach((dayId, index) => {
                const dayName = mapDayIdToName(parseInt(dayId)); // Ensure dayId is parsed as an integer
                if (dayName) {
                    if (shiftsJson[index]) {
                        const parsedShifts = JSON.parse(shiftsJson[index]);
                        parsedShifts.forEach(shift => {
                            availability[dayName].push({
                                shift_start: shift.shift_start,
                                shift_end: shift.shift_end
                            });
                        });
                    }
                } else {
                    console.error('Invalid day id:', dayId);
                }
            });
        }

        const selectStationsQuery = `
            SELECT station.station_name
            FROM station
            INNER JOIN employee_station_assignment ON station.station_id = employee_station_assignment.station_id
            INNER JOIN working_information ON employee_station_assignment.working_information_id = working_information.working_information_id
            WHERE working_information.working_information_id = ?`;

        const [stations] = await db.promise().execute(selectStationsQuery, [employee.working_information_id]);

        const formattedEmployee = {
            name: employee.person_name,
            crew_id: employee.crew_id,
            poscod: employee.poscod,
            hired_date: employee.hired_date,
            status: employee.status,
            job_status: employee.job_status,
            created_by: employee.creator_name,
            availability: availability,
            stations_assigned: stations.map(station => station.station_name)
        };

        res.status(200).json(formattedEmployee);
    } catch (error) {
        console.error('Error retrieving employee:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// retrieve employees by name
router.get('/name/:name', async (req, res) => {
    try {
        const employeeName = req.params.name;

        const selectEmployeeQuery = `
            SELECT
                pi.personal_information_id,
                pi.name AS person_name,
                wi.working_information_id,
                u.name AS creator_name,
                wa.area_id,
                a.area_name,
                wi.hired_date,
                wi.status,
                wi.job_status,
                wi.crew_id,
                wi.poscod,
                GROUP_CONCAT(sa.day_id) AS day_ids,
                GROUP_CONCAT(sa.shifts SEPARATOR ';') AS shifts_json
            FROM personal_information pi
            JOIN working_information wi ON pi.personal_information_id = wi.personal_information_id
            LEFT JOIN shift_availability sa ON wi.working_information_id = sa.working_information_id
            LEFT JOIN working_area wa ON wi.working_information_id = wa.working_information_id
            LEFT JOIN area a ON wa.area_id = a.area_id
            LEFT JOIN user u ON wi.created_by = u.user_id
            WHERE pi.name = ?
            GROUP BY wi.working_information_id, pi.personal_information_id`;

        const [employeeData] = await db.promise().execute(selectEmployeeQuery, [employeeName]);

        if (employeeData.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const employee = employeeData[0];

        const availability = {
            sunday: [],
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: []
        };

        if (employee.day_ids && employee.shifts_json) {
            const dayIds = employee.day_ids.split(',');
            const shiftsJson = employee.shifts_json.split(';');

            dayIds.forEach((dayId, index) => {
                const dayName = mapDayIdToName(parseInt(dayId)); // Ensure dayId is parsed as an integer
                if (dayName) {
                    if (shiftsJson[index]) {
                        const parsedShifts = JSON.parse(shiftsJson[index]);
                        parsedShifts.forEach(shift => {
                            availability[dayName].push({
                                shift_start: shift.shift_start,
                                shift_end: shift.shift_end
                            });
                        });
                    }
                } else {
                    console.error('Invalid day id:', dayId);
                }
            });
        }

        const selectStationsQuery = `
            SELECT station.station_name
            FROM station
            INNER JOIN employee_station_assignment ON station.station_id = employee_station_assignment.station_id
            INNER JOIN working_information ON employee_station_assignment.working_information_id = working_information.working_information_id
            WHERE working_information.working_information_id = ?`;

        const [stations] = await db.promise().execute(selectStationsQuery, [employee.working_information_id]);

        const formattedEmployee = {
            name: employee.person_name,
            crew_id: employee.crew_id,
            poscod: employee.poscod,
            hired_date: employee.hired_date,
            status: employee.status,
            job_status: employee.job_status,
            created_by: employee.creator_name,
            availability: availability,
            stations_assigned: stations.map(station => station.station_name)
        };

        res.status(200).json(formattedEmployee);
    } catch (error) {
        console.error('Error retrieving employee:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// retrieve days with shift_availability by employee crew_id
router.get('/availability/:crew_id', async (req, res) => {
    try {
        const employeeId = req.params.crew_id;

        // retrieve days with shift_availability for the specified employee
        const selectAvailabilityQuery = `
            SELECT
                pi.name AS person_name,
                wi.crew_id,
                sa.day_id,
                dn.day_name,
                sa.shifts
            FROM working_information wi
            LEFT JOIN shift_availability sa ON wi.working_information_id = sa.working_information_id
            LEFT JOIN day dn ON sa.day_id = dn.day_id
            JOIN personal_information pi ON wi.personal_information_id = pi.personal_information_id
            WHERE wi.crew_id = ?`;

        const [availabilityInfo] = await db.promise().execute(selectAvailabilityQuery, [employeeId]);

        if (availabilityInfo.length === 0) {
            return res.status(404).json({ error: 'Employee not found or no shift availability' });
        }

        // initialize availability object with empty arrays for each day
        const availability = {
            sunday: [],
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
        };

        // Populate availability object with shifts
        availabilityInfo.forEach(entry => {
            const dayName = entry.day_name.toLowerCase();
            if (entry.shifts) {
                const shifts = JSON.parse(entry.shifts);
                shifts.forEach(shift => {
                    availability[dayName].push({
                        shift_start: shift.shift_start,
                        shift_end: shift.shift_end
                    });
                });
            }
        });

        // create response object
        const response = {
            name: availabilityInfo[0].person_name,
            crew_id: availabilityInfo[0].crew_id,
            availability: availability
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error retrieving days with shift_availability:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// update employee info by crew id
router.put('/:crew_id', async (req, res) => {
    try {
        const crewId = req.params.crew_id;
        const { poscod, availability, stations_assigned, job_status } = req.body;
        const creatorName = req.user.userId;

        // retrieve working_information_id based on crew_id
        const selectWorkingInfoQuery = 'SELECT working_information_id FROM working_information WHERE crew_id = ?';
        const [workingInfoResult] = await db.promise().execute(selectWorkingInfoQuery, [crewId]);

        if (workingInfoResult.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const workingInformationId = workingInfoResult[0].working_information_id;

        // update working_information table
        const updateWorkingInfoQuery = 'UPDATE working_information SET poscod = ?, job_status = ?, created_by = ? WHERE working_information_id = ?';
        await db.promise().execute(updateWorkingInfoQuery, [poscod, job_status, creatorName, workingInformationId]);

        // delete existing availability records for the employee
        const deleteShiftAvailabilityQuery = 'DELETE FROM shift_availability WHERE working_information_id = ?';
        await db.promise().execute(deleteShiftAvailabilityQuery, [workingInformationId]);

        // insert new availability for each day
        for (const [day_name, shifts] of Object.entries(availability)) {
            for (const shift of shifts) {
                if (shift.shift_start && shift.shift_end) { // check if shift data is provided
                    const { shift_start, shift_end } = shift;

                    // retrieve day_id based on day_name
                    const selectDayIdQuery = 'SELECT day_id FROM day WHERE day_name = ?';
                    const [dayIdResult] = await db.promise().execute(selectDayIdQuery, [day_name]);
                    const dayId = dayIdResult[0].day_id;

                    // insert into shift_availability table using working_information_id and day_id
                    const insertShiftAvailabilityQuery = 'INSERT INTO shift_availability (working_information_id, day_id, shifts) VALUES (?, ?, ?)';
                    await db.promise().execute(insertShiftAvailabilityQuery, [workingInformationId, dayId, JSON.stringify([{ shift_start, shift_end }])]);
                }
            }
        }

        // delete existing station assignments for the employee
        const deleteStationAssignmentQuery = 'DELETE FROM employee_station_assignment WHERE working_information_id = ?';
        await db.promise().execute(deleteStationAssignmentQuery, [workingInformationId]);

        // insert new station assignments for the employee
        for (const station of stations_assigned) {
            // Retrieve station_id based on station_name
            const selectStationIdQuery = 'SELECT station_id FROM station WHERE station_name = ?';
            const [stationIdResult] = await db.promise().execute(selectStationIdQuery, [station]);
            if (stationIdResult.length > 0) { // Ensure station exists
                const station_id = stationIdResult[0].station_id;

                // insert into employee_station_assignment table using working_information_id and station_id
                const insertStationAssignmentQuery = 'INSERT INTO employee_station_assignment (working_information_id, station_id) VALUES (?, ?)';
                await db.promise().execute(insertStationAssignmentQuery, [workingInformationId, station_id]);
            } else {
                console.error('Station not found:', station);
            }
        }

        res.status(200).json({ message: 'Employee updated successfully' });
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// update employee status (active/inactive) using crew_id 
router.put('/status/:crew_id', async (req, res) => {
    try {
        const employeeId = req.params.crew_id;
        const { status } = req.body;
        const creatorName = req.user.userId;

        // update the status of the employee
        const updateStatusQuery = 'UPDATE working_information SET status = ?, created_by = ? WHERE crew_id = ?';
        await db.promise().execute(updateStatusQuery, [status, creatorName, employeeId]);

        res.status(200).json({ message: 'Employee status updated successfully' });
    } catch (error) {
        console.error('Error updating employee status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// helper function to map day id to name
function mapDayIdToName(dayId) {
    switch (dayId) {
        case 7:
            return 'sunday';
        case 1:
            return 'monday';
        case 2:
            return 'tuesday';
        case 3:
            return 'wednesday';
        case 4:
            return 'thursday';
        case 5:
            return 'friday';
        case 6:
            return 'saturday';
        default:
            return 'unknown';
    }
}


// update employee record status (e.g., on-leave status) using employee crew_id 
// router.put('/record-status/:crew_id', async (req, res) => {
//     try {
//         const employeeId = req.params.crew_id;
//         const { record_status } = req.body;

//         // update the record status of the employee
//         const updateRecordStatusQuery = 'UPDATE working_information SET record_status = ? WHERE crew_id = ?';
//         await db.promise().execute(updateRecordStatusQuery, [record_status, employeeId]);

//         res.status(200).json({ message: 'Employee record status updated successfully' });
//     } catch (error) {
//         console.error('Error updating employee record status:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

module.exports = router;
