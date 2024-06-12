const fs = require('fs');
const csv = require('csv-parser');
const db = require('../database/db');

const importCSV = (req, res) => {


    
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded or file is not in CSV format' });
    }

    const csvFilePath = req.file.path;
    console.log(csvFilePath);

    const newcsvFilePath = './uploads/' + csvFilePath.replace('uploads\\', '');

    const creatorName = req.user.userId;

    const areaMapping = {};
    const stationMapping = {};
    const errors = [];

    const selectAreasQuery = 'SELECT area_id, area_name FROM area';
    db.query(selectAreasQuery, (err, areas) => {
        if (err) {
            console.error('Error retrieving areas:', err);
            errors.push('Error retrieving areas from the database');
            return res.status(500).json({ errors });
        }

        areas.forEach(area => {
            areaMapping[area.area_name] = area.area_id;
        });

        const selectStationsQuery = 'SELECT station_id, station_name, area_id FROM station';
        db.query(selectStationsQuery, (err, stations) => {
            if (err) {
                console.error('Error retrieving stations:', err);
                errors.push('Error retrieving stations from the database');
                return res.status(500).json({ errors });
            }

            stations.forEach(station => {
                stationMapping[station.station_name] = {
                    station_id: station.station_id,
                    area_id: station.area_id
                };
            });

            fs.createReadStream(newcsvFilePath)
                .pipe(csv())
                .on('headers', (headers) => {
                    console.log('CSV Headers:', headers);
                })
                .on('data', (row) => {
                    const checkDuplicateQuery = `
                        SELECT * FROM working_information wi
                        JOIN personal_information pi ON wi.personal_information_id = pi.personal_information_id
                        WHERE wi.crew_id = ?`;
                    const checkDuplicateValues = [row['Crew ID']];
                    db.query(checkDuplicateQuery, checkDuplicateValues, (err, crewIdResult) => {
                        if (err) {
                            console.error('Error checking for Crew ID duplicates:', err);
                            errors.push(`Error checking for Crew ID duplicates: ${err.message}`);
                            return;
                        }

                        if (crewIdResult.length > 0) {
                            console.log(`Error: Duplicate Crew ID '${row['Crew ID']}' found in the database. Skipping insertion.`);
                            errors.push(`Duplicate Crew ID '${row['Crew ID']}' found in the database. Skipping insertion.`);
                            return;
                        }

                        const checkDuplicateNameQuery = `
                            SELECT * FROM personal_information WHERE name = ?`;
                        const checkDuplicateNameValues = [row['Employee Name']];
                        db.query(checkDuplicateNameQuery, checkDuplicateNameValues, (err, nameResult) => {
                            if (err) {
                                console.error('Error checking for name duplicates:', err);
                                errors.push(`Error checking for name duplicates: ${err.message}`);
                                return;
                            }

                            if (nameResult.length > 0) {
                                console.log(`Error: Duplicate Employee Name '${row['Employee Name']}' found in the database. Skipping insertion.`);
                                errors.push(`Duplicate Employee Name '${row['Employee Name']}' found in the database. Skipping insertion.`);
                                return;
                            }

                            const personalInformationQuery = `
                                INSERT INTO personal_information (name)
                                VALUES (?)`;
                            const personalInformationValues = [row['Employee Name'] || ''];

                            db.query(personalInformationQuery, personalInformationValues, (err, personalInformationResult) => {
                                if (err) {
                                    console.error('Error inserting personal_information row:', err);
                                    errors.push('Error inserting personal information into the database');
                                    return;
                                } else {
                                    const personalInformationId = personalInformationResult.insertId;

                                    console.log('Inserted Personal Information:', {
                                        personal_information_id: personalInformationId,
                                        name: personalInformationValues[0]
                                    });

                                    const dateHired = row['Date Hired'] ? new Date(row['Date Hired']) : null;

                                    const workingInformationQuery = `
                                        INSERT INTO working_information (personal_information_id, hired_date, crew_id, poscod, job_status, created_by)
                                        VALUES (?, ?, ?, ?, ?, ?)`;

                                    const workingInformationValues = [
                                        personalInformationId,
                                        dateHired,
                                        row['Crew ID'] || null,
                                        row['Position Code'] || null,
                                        row['Job Status'] || null,
                                        creatorName
                                    ];

                                    db.query(workingInformationQuery, workingInformationValues, (err, workingInformationResult) => {
                                        if (err) {
                                            console.error('Error inserting working_information row:', err);
                                            errors.push('Error inserting working information into the database');
                                            return;
                                        } else {
                                            const workingInformationId = workingInformationResult.insertId;

                                            console.log('Inserted Working Information:', {
                                                working_information_id: workingInformationId,
                                                personal_information_id: personalInformationId,
                                                hired_date: dateHired,
                                                crew_id: row['Crew ID'] || null,
                                                poscod: row['Position Code'] || null,
                                                job_status: row['Job Status'] || null
                                            });

                                            const trainedStations = (row['Trained Station'] || '').split('/');
                                            for (const stationName of trainedStations) {
                                                const trimmedStationName = stationName.trim();

                                                if (trimmedStationName in stationMapping) {
                                                    const { station_id } = stationMapping[trimmedStationName];

                                                    const stationAssignmentQuery = `
                                                        INSERT INTO employee_station_assignment (working_information_id, station_id)
                                                        VALUES (?, ?)`;
                                                    const stationAssignmentValues = [workingInformationId, station_id];

                                                    db.query(stationAssignmentQuery, stationAssignmentValues, (err, stationAssignmentResult) => {
                                                        if (err) {
                                                            console.error(`Error inserting employee_station_assignment row for station '${trimmedStationName}':`, err);
                                                            errors.push(`Error inserting employee station assignment for station '${trimmedStationName}'`);
                                                        } else {
                                                            console.log(`Employee Station Assignment for '${trimmedStationName}' inserted successfully:`, stationAssignmentResult);
                                                        }
                                                    });
                                                } else {
                                                    console.error(`Warning: Station '${trimmedStationName}' not found in the mapping.`);
                                                }
                                            }

                                            const shiftAvailabilityQuery = `
                                                INSERT INTO shift_availability (working_information_id, day_id, shifts)
                                                VALUES (?, ?, ?)`;

                                            for (const day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']) {
                                                const shifts = row[day].split('/');

                                                const mappedShifts = shifts.map(shift => {
                                                    if (!shift.trim()) {
                                                        return null;
                                                    }

                                                    const [shift_start, shift_end] = shift.trim().split('-');
                                                    return {
                                                        shift_start: shift_start || '',
                                                        shift_end: shift_end || ''
                                                    };
                                                });

                                                const filteredShifts = mappedShifts.filter(shift => shift !== null);

                                                const shiftsJSON = JSON.stringify(filteredShifts);

                                                const dayIdQuery = `SELECT day_id FROM day WHERE day_name = ?`;
                                                db.query(dayIdQuery, [day], (err, result) => {
                                                    if (err) {
                                                        console.error('Error retrieving day_id:', err);
                                                        errors.push('Error retrieving day information from the database');
                                                        return;
                                                    } else {
                                                        const dayId = result[0].day_id;
                                                        const shiftValues = [workingInformationId, dayId, shiftsJSON];

                                                        db.query(shiftAvailabilityQuery, shiftValues, (err, shiftResult) => {
                                                            if (err) {
                                                                console.error('Error inserting shift_availability row:', err);
                                                                errors.push('Error inserting shift availability into the database');
                                                            } else {
                                                                console.log('Row inserted successfully:', shiftResult);
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        });
                    });
                })
                .on('end', () => {
                    console.log('CSV import completed');
                    if (errors.length > 0) {
                        return res.status(400).json({ errors });
                    }
                    res.status(200).json({ message: 'CSV import completed' });
                });
        });
    });
};

module.exports = { importCSV };
