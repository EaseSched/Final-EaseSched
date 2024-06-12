const express = require("express"); // Import the Express framework
const db = require("../database/db"); // Import the database connection
const moment = require("moment"); // Import the moment
const router = express.Router(); // Create a new Express router

// Fetch employee information with shift availability and filters
function getEmployeeInformation() {
  return new Promise((resolve, reject) => {
    const query = `
    SELECT sa.*, wi.status AS working_status, eol.leave_status, esa.station_id, pi.name
    FROM shift_availability sa
    JOIN working_information wi ON sa.working_information_id = wi.working_information_id
    LEFT JOIN employee_on_leave eol ON sa.working_information_id = eol.working_information_id
    LEFT JOIN employee_station_assignment esa ON wi.working_information_id = esa.working_information_id
    LEFT JOIN personal_information pi ON wi.personal_information_id = pi.personal_information_id
    WHERE wi.status = 'Active' AND (eol.leave_status IS NULL OR eol.leave_status != 'Active')
    `; // SQL query to fetch active employees with their shift availability and leave status
    db.query(query, (err, results) => {
      if (err) {
        reject(err); // Reject the promise if there's an error
        return;
      }
      results.forEach((employee) => {
        try {
          employee.shifts = JSON.parse(employee.shifts).map(
            (shift) => `${shift.shift_start}-${shift.shift_end}`
          ); // Parse and format shifts for each employee
        } catch (error) {
          console.error("Error parsing employee shifts:", error, "for employee:", employee);
          employee.shifts = []; // Handle errors in parsing shifts
        }
        // console.log(typeof employee.shifts);
      });
      // console.log(results); // Log the results (verified)
      resolve(results); // Resolve the promise with the results
    });
  });
}

// Fetch stations with their area names
function getStations() {
  return new Promise((resolve, reject) => {
    const query = `SELECT s.*, a.area_name FROM station s JOIN area a ON s.area_id = a.area_id`; // SQL query to fetch station details and their area names
    db.query(query, (err, results) => {
      if (err) {
        reject(err); // Reject the promise if there's an error
        return;
      }
      // console.log(results); // Log the results (verified)
      resolve(results); // Resolve the promise with the results
    });
  });
}

// Fetch station shift availability
function getStationShiftAvailability() {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM station_shift_availability`; // SQL query to fetch station shift availability
    db.query(query, (err, results) => {
      if (err) {
        reject(err); // Reject the promise if there's an error
        return;
      }
      results.forEach((stationShift) => {
        try {
          stationShift.shift_timings = JSON.parse(stationShift.shift_timings).map(
            (shift) => `${shift.shift_start}-${shift.shift_end}`
          ); // Parse and format shift timings for each station
        } catch (error) {
          console.error("Error parsing station shifts:", error, "for stationShift:", stationShift);
          stationShift.shift_timings = []; // Handle errors in parsing shifts
        }
        // console.log(typeof stationShift.shift_timings);
        // console.log(stationShift.shift_timings);
      });
      // console.log(results); // Log the results (verified)
      resolve(results); // Resolve the promise with the results
    });
  });
}

// Function to get the employee shifts and station shift timings from the getEmployeeInformation and getStationShiftAvailability functions
async function getShiftsAndTimings() {
  try {
    const employees = await getEmployeeInformation(); // Fetch employee information
    const stations = await getStations(); // Fetch station information
    const stationShifts = await getStationShiftAvailability(); // Fetch station shift availability

    return { employees, stations, stationShifts }; // Return the fetched data
  } catch (error) {
    throw error; // Throw an error if something goes wrong
  }
}

// Function to create the schedule
async function createSchedule() {
  try {
    const { employees, stations, stationShifts } = await getShiftsAndTimings(); // Fetch employee shifts and station shift timings
    
    const schedule = []; // Initialize the schedule array
    // console.log(employees);
    
    employees.forEach((employee) => {


      const employeeAvailability = employee.shifts; // Directly use the employee's shift availability

      employeeAvailability.forEach((employeeShift) => {
        const [employeeShiftStart, employeeShiftEnd] = employeeShift.split('-');
        
        stationShifts.forEach((stationShift) => {
          
          if (employee.day_id === stationShift.day_id) { // Compare day_id
            const stationShiftAvailability = stationShift.shift_timings; // Directly use the station shift timings

            stationShiftAvailability.forEach((stationShiftTime) => {
              const [stationShiftStart, stationShiftEnd] = stationShiftTime.split('-');
              
              if (employeeShiftStart <= stationShiftStart && employeeShiftEnd >= stationShiftEnd) {
                // Find the corresponding station and area
                const station = stations.find(employee => employee.station_id === stationShift.station_id);
                const area = stations.find(area => area.area_id === station.area_id);

                if (station && area) {
                  schedule.push({
                    employee_id: employee.working_information_id,
                    employee_name: employee.name,
                    station_id: station.station_id,
                    station_name: station.station_name,
                    shift_start: employeeShiftStart,
                    shift_end: employeeShiftEnd,
                    day_id: employee.day_id,
                    area_id: station.area_id,
                    area_name: area.area_name
                  });
                }
              }
            });
          }
        });
      });
    });
    

    return schedule; // Return the schedule
  } catch (error) {
    console.error("Error creating schedule:", error); // Log the error
    throw error; // Throw an error if something goes wrong
  }
}


// Route to get the schedule
router.get("/scheduler/", async (req, res) => {
  try {
    // Create the schedule
    const schedule = await createSchedule();
    
    // Send the schedule as a response
    res.status(200).json({ message: "Backtrack Schedule created successfully", schedule });
  } catch (error) {
    // Send an error message if something goes wrong
    res.status(500).json({ message: "Error creating schedule", error: error.message });
  }
});

// Route to get all the schedules in records table
router.get("/schedule/all", (req, res) => {
  const query = `SELECT * FROM records`; // SQL query to fetch all records
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ message: "Error fetching records", error: err.message }); // Send an error message if something goes wrong
      return;
    }
    res.status(200).json({ message: "Records fetched successfully", records: results }); // Send the records as a response
  });
}); 

module.exports = router; // Export the router to be used in the main app
