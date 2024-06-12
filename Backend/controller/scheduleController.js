const db = require("../database/db");
const moment = require("moment");

// Fetch employee information with shift availability and filters
async function getEmployeeInformation() {
  const query = `
    SELECT sa.*, wi.status AS working_status, wi.crew_id AS id, eol.leave_status, esa.station_id, pi.name
    FROM shift_availability sa
    JOIN working_information wi ON sa.working_information_id = wi.working_information_id
    LEFT JOIN employee_on_leave eol ON sa.working_information_id = eol.working_information_id
    LEFT JOIN employee_station_assignment esa ON wi.working_information_id = esa.working_information_id
    LEFT JOIN personal_information pi ON wi.personal_information_id = pi.personal_information_id
    WHERE wi.status = 'Active' AND (eol.leave_status IS NULL OR eol.leave_status != 'Active')
  `;
  const [results] = await db.promise().query(query);
  results.forEach((employee) => {
    try {
      employee.shifts = JSON.parse(employee.shifts).map(
        (shift) => `${shift.shift_start}-${shift.shift_end}`
      );
    } catch (error) {
      console.error(
        "Error parsing employee shifts:",
        error,
        "for employee:",
        employee
      );
      employee.shifts = [];
    }
    // console.log(typeof [employee.shifts]);
  });
  // console.log(results);
  return results;
}

// Fetch stations with shift availability
async function getStationsAndShiftTimings() {
  const stationQuery = `SELECT s.*, a.area_name FROM station s JOIN area a ON s.area_id = a.area_id`;
  const [stations] = await db.promise().query(stationQuery);

  const stationShiftQuery = `SELECT ssa.*, a.area_name, s.station_name
  FROM station_shift_availability ssa 
  LEFT JOIN station s ON ssa.station_id = s.station_id
  JOIN area a ON s.area_id = a.area_id;`;
  const [stationShifts] = await db.promise().query(stationShiftQuery);
  stationShifts.forEach((stationShift) => {
    try {
      stationShift.shift_timings = JSON.parse(stationShift.shift_timings).map(
        (shift) => `${shift.shift_start}-${shift.shift_end}`
      );
    } catch (error) {
      console.error(
        "Error parsing station shifts:",
        error,
        "for stationShift:",
        stationShift
      );
      stationShift.shift_timings = [];
    }
  });

  // console.log(stations, stationShifts);
  return { stations, stationShifts };
}

// Function to get the employee shifts and station shift timings
async function getShiftsAndTimings() {
  try {
    const employees = await getEmployeeInformation();
    const { stations, stationShifts } = await getStationsAndShiftTimings();
    return { employees, stations, stationShifts };
  } catch (error) {
    throw error;
  }
}

// Function to create the schedule
async function createSchedule() {
  try {
    const { employees, stations, stationShifts } = await getShiftsAndTimings(); // Fetch employee shifts and station shift timings

    const schedule = []; // Initialize the schedule array
    const scheduledEmployees = new Set(); // Initialize a set to track scheduled employees by day_id

    employees.forEach((employee) => {
      const employeeAvailability = employee.shifts; // Directly use the employee's shift availability

      employeeAvailability.forEach((employeeShift) => {
        const [employeeShiftStart, employeeShiftEnd] = employeeShift.split("-");
        // console.log(stationShifts,"hhhhhhhhhhhhhhhhhhhhhhhhhhhh");
        // return;
        stationShifts.forEach((stationShift) => {
          if (employee.station_id === stationShift.station_id) {
            if (employee.day_id === stationShift.day_id) {
              // Compare day_id
              const stationShiftAvailability = stationShift.shift_timings; // Directly use the station shift timings

              // console.log(stationShift, "pppppppppppp");
              stationShiftAvailability.forEach((stationShiftTime) => {
                const [stationShiftStart, stationShiftEnd] =
                  stationShiftTime.split("-");

                if (
                  employeeShiftStart <= stationShiftStart &&
                  employeeShiftEnd >= stationShiftEnd
                ) {
                  const employeeDayKey = `${employee.working_information_id}-${employee.day_id}`;
                  if (!scheduledEmployees.has(employeeDayKey)) {
                    // // Find the corresponding station and area
                    // const station = stations.find(
                    //   (station) => station.station_id === employee.station_id
                    // );
                    // const area = stations.find(
                    //   (area) => area.area_id === station.area_id
                    // );

                    // if (station && area) {
                    let times = Array(24).fill(0);

                    const start = parseInt(employeeShiftStart.split(":")[0]);
                    const end = parseInt(employeeShiftEnd.split(":")[0]);

                    if (start > end) {
                      for (let i = 0; i < 24; i++) {
                        // 18 > 6

                        // i = 18 <= 6
                        if (i < end) {
                          times[i] = 2;
                        } else {
                          // i = 19 > = 18
                          if (i >= start) {
                            times[i] = 1;
                          }
                        }
                        // console.log(i, start, "HEre");
                        // 18 > = 18
                      }
                    }

                    if (start <= end) {
                      for (let i = 0; i < end; i++) {
                        // 18 > 6
                        if (start <= i && i < end) times[i] = 1;
                      }
                    }
                    // console.log(stations);
                    schedule.push({
                      crew_id: employee.id,
                      employee_name: employee.name,
                      station_id: stationShift.station_id,
                      station_name: stationShift.station_name,
                      shift_start: employeeShiftStart,
                      shift_end: employeeShiftEnd,

                      start: start,
                      end: end,

                      // shift_start: stationShift.stationShiftStart,
                      // shift_end: stationShift.stationShiftEnd,
                      available_time: times,
                      day_id: employee.day_id,
                      area_id: stationShift.area_id,
                      area_name: stationShift.area_name,
                    });

                    // Mark this employee as scheduled for this day
                    scheduledEmployees.add(employeeDayKey);
                    // }
                  }
                }
              });
            }
          }
        });
      });
    });

    // console.log(schedule);
    return schedule; // Return the schedule
  } catch (error) {
    console.error("Error creating schedule:", error); // Log the error
    throw error; // Throw an error if something goes wrong
  }
}

// Function to insert the schedule into the database
async function insertScheduleIntoDB(schedule, userId) {
  try {
    const start = moment().format("YYYY-MM-DD");
    // add 7 days to start date
    const end = moment().add(7, "days").format("YYYY-MM-DD");
    // console.log(start, end, userId);
    const query = `
      INSERT INTO records (records, start_date, end_date, created_by)
      VALUES (?, ?, ?, ?)
    `;
    const recordsJSON = JSON.stringify(schedule);
    await db.promise().query(query, [recordsJSON, start, end, userId]);
  } catch (error) {
    console.error("Error inserting schedule into database:", error);
    throw error;
  }
}

module.exports = {
  getEmployeeInformation,
  getStationsAndShiftTimings,
  getShiftsAndTimings,
  createSchedule,
  insertScheduleIntoDB,
};
