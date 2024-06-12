const fs = require('fs');
const csv = require('csv-parser');
const fetch = require('node-fetch');
const db = require('../database/db');

const importStationCSV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded or file is not in CSV format' });
        }

        const csvFilePath = req.file.path;
        const newcsvFilePath = './uploads/' + csvFilePath.replace('uploads\\', '');
        console.log(newcsvFilePath);

        const token = req.headers.authorization;

        const existingStations = await db.promise().query('SELECT station_name FROM station');
        const existingStationNames = existingStations[0].map(station => station.station_name);

        fs.createReadStream(newcsvFilePath)
            .pipe(csv())
            .on('data', async (row) => {
                try {
                    const areaName = row['Area Name'];
                    const stationName = row['Station Name'];
                    const numberOfEmployee = parseInt(row['Number of Employee']);
                    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

                    if (existingStationNames.includes(stationName)) {
                        console.log(`Error: Station "${stationName}" already exists in the database. Skipping.`);
                        return;
                    }

                    const addStationResponse = await fetch('http://localhost:3000/station/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token
                        },
                        body: JSON.stringify({
                            area_id: areaName === 'Production' ? 1 : 2,
                            station_name: stationName,
                            number_of_employee: numberOfEmployee,
                            availability: daysOfWeek.map(day => ({
                                day_name: day,
                                shift_timings: row[day].split('/').map(shift => {
                                    const [start, end] = shift.split('-');
                                    return { shift_start: start, shift_end: end };
                                })
                            }))
                        })
                    });

                    const responseData = await addStationResponse.json();
                    console.log(responseData);
                } catch (error) {
                    console.error('Error processing CSV row:', error);
                }
            })
            .on('end', () => {
                console.log('CSV import completed');
                res.status(200).json({ message: 'CSV import completed' });
            });
    } catch (error) {
        console.error('Error importing station CSV:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { importStationCSV };
