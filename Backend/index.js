const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { authenticateToken, isAdmin, isManager } = require('./authentication/middleware');
const userRoutes = require('./routes/userRoutes');
const db = require('./database/db');
const csvRoutes = require('./routes/csvRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const roleRoutes = require('./routes/roleRoutes');
const authRoutes = require('./routes/authRoutes');
const stationRoutes = require('./routes/stationRoutes');
const stationCsvRoutes = require('./routes/stationCsvRoutes');
const employeeOnLeaveRoutes = require('./routes/employeeOnLeaveRoutes');
const employeeOnLeaveCsvRoutes = require('./routes/employeeOnLeaveCsvRoutes');
const scheduleRoutes = require('./routes/schedulerAlgorithm');
const schedAPI = require('./routes/schedulerRoutes');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT;

// login
app.use('/auth', authRoutes);

app.use(authenticateToken);
 // admin only routes
app.use('/user', userRoutes);
app.use('/role', roleRoutes);
app.use('/sched', scheduleRoutes, schedAPI);

// routes accessible to manager and shift manager
app.use('/employee', employeeRoutes);
app.use('/csv', csvRoutes);
app.use('/station', stationRoutes);
app.use('/csvStation', stationCsvRoutes)
app.use('/employeeOnLeave', employeeOnLeaveRoutes)
app.use('/csvLeave', employeeOnLeaveCsvRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
