const express = require("express"); // Import the Express framework
const router = express.Router(); // Create a new Express router
const db = require("../database/db"); // Import the database connection
const scheduleController = require("../controller/scheduleController"); // Import the schedule controller

// Route to create and save the schedule
router.get("/schedule", async (req, res) => {
  try {
    const schedule = await scheduleController.createSchedule();
    // const userId = req.user.userId;
    // await scheduleController.insertScheduleIntoDB(schedule, userId);
    res
      .status(200)
      .json({ message: "Schedule created successfully", schedule });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating schedule", error: error.message });
  }
});

// Route to insert to database the verified schedule from the frontend
router.post("/schedule/insert", async (req, res) => {
  try {
    const { schedule } = req.body;
    const userId = req.user.userId;
    await scheduleController.insertScheduleIntoDB(schedule, userId);
    res.status(200).json({ message: "Schedule inserted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error inserting schedule", error: error.message });
  }
});

// Route to get all the schedules in records table
router.get("/schedule/all", async (req, res) => {
  try {
    const query = `SELECT * FROM records`;
    const [results] = await db.promise().query(query);
    res
      .status(200)
      .json({ message: "Records fetched successfully", records: results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching records", error: err.message });
  }
});

// Route to get the latest schedule in records table
router.get("/schedule/latest", async (req, res) => {
  try {
    const query = `SELECT * FROM records ORDER BY record_id DESC LIMIT 1`;
    const [results] = await db.promise().query(query);
    res.status(200).json({
      message: "Latest record fetched successfully",
      record: results[0],
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching latest record", error: err.message });
  }
});

// Route to get the station record
router.get("/displayStations", async (req, res) => {
  try {
    const productionQuery = `SELECT * FROM station WHERE area_id = 1`;
    const [results] = await db.promise().query(productionQuery);

    console.log(productionQuery);
    res.status(200).json({
      results,
    });
  } catch (err) {
    res.status(404).json({ error: err });
  }
});

module.exports = router; // Export the router to be used in the main app
