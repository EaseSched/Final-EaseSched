const express = require('express');
const db = require('../database/db');
const { authenticateToken, isAdmin, isManager } = require('../authentication/middleware');

const router = express.Router();

// create station
router.post('/add', async (req, res) => {
    try {
        const { area_id, station_name, number_of_employee, availability } = req.body;
        const creatorName = req.user.userId;

        // validate input
        if (!area_id || !station_name || !number_of_employee || !availability || availability.length === 0) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // insert into database
        const insertStationQuery = 'INSERT INTO station (area_id, station_name, number_of_employee, created_by) VALUES (?, ?, ?, ?)';
        const [insertedStation] = await db.promise().execute(insertStationQuery, [area_id, station_name, number_of_employee, creatorName]);

        const stationId = insertedStation.insertId;

        for (const dayInfo of availability) {
            const { day_name, shift_timings } = dayInfo;

            // retrieve day_id based on day_name
            const selectDayIdQuery = 'SELECT day_id FROM day WHERE day_name = ?';
            const [dayIdResult] = await db.promise().execute(selectDayIdQuery, [day_name]);
            const dayId = dayIdResult[0].day_id;

            const insertShiftAvailabilityQuery = 'INSERT INTO station_shift_availability (station_id, day_id, shift_timings) VALUES (?, ?, ?)';
            await db.promise().execute(insertShiftAvailabilityQuery, [stationId, dayId, JSON.stringify(shift_timings)]);
        }

        res.status(201).json({ message: 'Station created successfully' });
    } catch (error) {
        console.error('Error creating station:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// modify station by station id
router.put('/:station_id', async (req, res) => {
    try {
        const { area_id, station_name, number_of_employee, availability } = req.body;
        const { station_id } = req.params;
        const creatorName = req.user.userId;

        // validate input
        if (!area_id || !station_name || !number_of_employee || !availability || !Array.isArray(availability) || availability.length === 0) {
            return res.status(400).json({ error: 'Missing required fields or invalid availability format' });
        }

        // update existing station information
        const updateStationQuery = 'UPDATE station SET area_id = ?, station_name = ?, number_of_employee = ?, created_by = ? WHERE station_id = ?';
        await db.promise().execute(updateStationQuery, [area_id, station_name, number_of_employee, creatorName, station_id]);

        // delete existing shift availability for the station
        const deleteShiftAvailabilityQuery = 'DELETE FROM station_shift_availability WHERE station_id = ?';
        await db.promise().execute(deleteShiftAvailabilityQuery, [station_id]);

        // insert new shift availability for the station
        for (const dayInfo of availability) {
            const { day_name, shift_timings } = dayInfo;

            // retrieve day_id based on day_name
            const selectDayIdQuery = 'SELECT day_id FROM day WHERE day_name = ?';
            const [dayIdResult] = await db.promise().execute(selectDayIdQuery, [day_name]);
            const dayId = dayIdResult[0].day_id;

            const insertShiftAvailabilityQuery = 'INSERT INTO station_shift_availability (station_id, day_id, shift_timings) VALUES (?, ?, ?)';
            await db.promise().execute(insertShiftAvailabilityQuery, [station_id, dayId, JSON.stringify(shift_timings)]);
        }

        res.status(200).json({ message: 'Station updated successfully' });
    } catch (error) {
        console.error('Error updating station:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//retrieve all stations
router.get('/all', async (req, res) => {
    try {
        // retrieve info for all stations with availability including the creator's name
        const selectAllStationsQuery = `
            SELECT
                s.station_id,
                s.station_name,
                s.number_of_employee,
                a.area_name,
                sa.day_id,
                sa.shift_timings,
                u.name AS creator_name
            FROM station s
            LEFT JOIN area a ON s.area_id = a.area_id
            LEFT JOIN station_shift_availability sa ON s.station_id = sa.station_id
            LEFT JOIN user u ON s.created_by = u.user_id
            ORDER BY s.station_id, sa.day_id`;

        const [allStations] = await db.promise().execute(selectAllStationsQuery);

        // format the result with the desired structure
        const formattedStations = [];
        let currentStation = null;
        allStations.forEach(station => {
            if (station.station_id !== currentStation?.station_id) {
                // new station found, add it to the result
                currentStation = {
                    station_id: station.station_id,
                    station_name: station.station_name,
                    number_of_employee: station.number_of_employee,
                    area_name: station.area_name,
                    created_by: station.creator_name,
                    availability: {
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                        sunday: [],
                    }
                };
                formattedStations.push(currentStation);
            }
            // add availability to the current station
            const dayName = mapDayIdToName(station.day_id);
            if (station.shift_timings) {
                const shiftTimings = JSON.parse(station.shift_timings);
                shiftTimings.forEach(shift => {
                    currentStation.availability[dayName].push({
                        shift_start: shift.shift_start,
                        shift_end: shift.shift_end,
                    });
                });
            }
        });

        res.status(200).json(formattedStations);
    } catch (error) {
        console.error('Error retrieving all stations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// retrieve specific station by station_name
router.get('/:station_name', async (req, res) => {
    try {
        const { station_name } = req.params;

        // retrieve station information
        const selectStationQuery = `
            SELECT
                s.station_id,
                s.station_name,
                s.number_of_employee,
                a.area_name,
                sa.day_id,
                sa.shift_timings,
                u.name AS creator_name
            FROM station s
            LEFT JOIN area a ON s.area_id = a.area_id
            LEFT JOIN station_shift_availability sa ON s.station_id = sa.station_id
            LEFT JOIN user u ON s.created_by = u.user_id
            WHERE s.station_name = ?
            ORDER BY sa.day_id`;

        const [stationInfo] = await db.promise().execute(selectStationQuery, [station_name]);

        // format the result with the desired structure
        if (stationInfo.length === 0) {
            return res.status(404).json({ error: 'Station not found' });
        }

        const formattedStation = {
            station_id: stationInfo[0].station_id,
            station_name: stationInfo[0].station_name,
            number_of_employee: stationInfo[0].number_of_employee,
            area_name: stationInfo[0].area_name,
            created_by: stationInfo[0].creator_name,
            availability: {
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
                sunday: [],
            }
        };

        stationInfo.forEach(shift => {
            const dayName = mapDayIdToName(shift.day_id);
            if (shift.shift_timings) {
                const shiftTimings = JSON.parse(shift.shift_timings);
                shiftTimings.forEach(shiftTime => {
                    formattedStation.availability[dayName].push({
                        shift_start: shiftTime.shift_start,
                        shift_end: shiftTime.shift_end,
                    });
                });
            }
        });

        res.status(200).json(formattedStation);
    } catch (error) {
        console.error('Error retrieving specific station:', error);
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


module.exports = router;
