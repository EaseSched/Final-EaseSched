const express = require("express");
const db = require("../database/db");
const { authenticateToken, isAdmin, isManager } = require("../authentication/middleware");
const router = express.Router();

// Fetch employee information with shift availability and filters
async function getEmployeeInformation() {
  const query = `
      SELECT sa.*, wi.status AS working_status, eol.leave_status, esa.station_id, pi.name
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
          console.error("Error parsing employee shifts:", error, "for employee:", employee);
          employee.shifts = [];
      }
  });
  return results;
}

// Fetch station information with shift timings
async function getStationInformation() {
  const query = `
      SELECT s.station_id, s.station_name, s.number_of_employee, ssa.day_id, ssa.shift_timings, s.area_id
      FROM station s
      JOIN station_shift_availability ssa ON s.station_id = ssa.station_id
  `;
  const [results] = await db.promise().query(query);
  results.forEach((station) => {
      try {
          station.shift_timings = JSON.parse(station.shift_timings).map(
              (shift) => `${shift.shift_start}-${shift.shift_end}`
          );
      } catch (error) {
          console.error("Error parsing station shift timings:", error, "for station:", station);
          station.shift_timings = [];
      }
  });
  return results;
}

// Fetch days
async function getDays() {
  const query = `SELECT * FROM day`;
  const [results] = await db.promise().query(query);
  return results;
}

// Fetch areas
async function getAreas() {
  const query = `SELECT * FROM area`;
  const [results] = await db.promise().query(query);
  return results;
}

// Create schedule by matching employee shifts with station shifts
function createSchedule(employees, stations, days, areas) {
  const schedule = [];

  stations.forEach((station) => {
      const stationEmployees = employees.filter(
          (employee) => employee.station_id === station.station_id
      );

      stationEmployees.forEach((employee) => {
          if (station.number_of_employee > 0) {
              const employeeShifts = employee.shifts;
              const stationShifts = station.shift_timings;

              const matchingShifts = employeeShifts.filter((shift) =>
                  stationShifts.includes(shift)
              );

              if (matchingShifts.length > 0) {
                  // Check if the employee is already assigned to this shift on the same day
                  const isAlreadyScheduled = schedule.some(
                      (s) =>
                          s.crew_id === employee.crew_id &&
                          s.station_id === station.station_id &&
                          s.day_id === station.day_id &&
                          s.shifts.some((shift) => matchingShifts.includes(shift))
                  );

                  if (!isAlreadyScheduled) {
                      // Get the day name
                      const day = days.find(d => d.day_id === station.day_id);
                      const area = areas.find(a => a.area_id === station.area_id);

                      // console.log(matchingShifts);
                 

                      // schedule.push({
                      //     name: employee.name,
                      //     crew_id: employee.crew_id,
                      //     station_id: station.station_id,
                      //     station_name: station.station_name,
                      //     shifts: matchingShifts,
                      //     day_id: station.day_id,
                      //     day_name: day ? day.day_name : '',
                      //     area_name: area ? area.area_name : ''
                      // });

                      let times = Array(24).fill(0);
                       
                      let start = parseInt(matchingShifts[0].split("-")[0].split(":")[0]);
                      let end = parseInt(matchingShifts[0].split("-")[1].split(":")[0]);
                      
                      schedule.push({
                        employee_name: employee.name,
                        employee_id: employee.crew_id,
                        station_id: station.station_id,
                        station_name: station.station_name,
                        shifts: matchingShifts,
                        
                      shift_start: matchingShifts[0].split("-")[0],
                      shift_end: matchingShifts[0].split("-")[1],
                      start: start,
                      end: end,
                      available_time: times,

                        day_id: station.day_id,
                        day_name: day ? day.day_name : '',
                        area_name: area ? area.area_name : ''
                    });



                      if(matchingShifts.length > 1){


                        let start = parseInt(matchingShifts[1].split("-")[0].split(":")[0]);
                        let end = parseInt(matchingShifts[1].split("-")[1].split(":")[0]);

                        if (start > end) {
                          for (let i = 0; i < 24; i++) {
                            // 18 > 6
                            if (i < end) {
                              times[i] = 2;
                            } else {
                              // i = 19 > = 18
                              if (i >= start) {
                                times[i] = 1;
                              } else {
                                times[i] = 0;
                              } 
                            }
                          }
                        }


                     schedule.push({
                        employee_id: employee.crew_id,
                        employee_name: employee.name,
                        // crew_id: employee.crew_id,
                        station_id: station.station_id,
                        station_name: station.station_name,
                        shifts: matchingShifts,
                        available_time: times,
                        
                        day_id: station.day_id,
                        day_name: day ? day.day_name : '',
                        area_name: area ? area.area_name : '',


                        shift_start: matchingShifts[1].split("-")[0],
                        shift_end: matchingShifts[1].split("-")[1],

                        start: start,
                        end: end

                     
                    });

                      } else{
                        if (start > end) {
                          for (let i = 0; i < 24; i++) {
                            // 18 > 6
                            if (i < end) {
                              times[i] = 2;
                            } else {
                              // i = 19 > = 18
                              if (i >= start) {
                                times[i] = 1;
                              } else {
                                times[i] = 0;
                              } 
                            }
                          }
                        }

                        if (start <= end) {
                          for (let i = 0; i < end; i++) {
                            // 18 > 6
                            if (start <= i && i < end) times[i] = 1;
                          }
                        }

                      }




                      station.number_of_employee -= 1;
                  }
              }
          }
      });
  });

  return schedule;
}


// Endpoint to retrieve schedule
router.get("/schedule/test", async (req, res) => {
  try {
      const employees = await getEmployeeInformation();
      const stations = await getStationInformation();
      const days = await getDays();
      const areas = await getAreas();

      const schedule = createSchedule(employees, stations, days, areas);

      res.json(schedule);
  } catch (error) {
      console.error("Error generating schedule:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
