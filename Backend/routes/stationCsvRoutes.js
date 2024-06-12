const express = require('express');
const router = express.Router();
const stationController = require('../controller/stationController');
const { authenticateToken } = require('../authentication/middleware');
const multer = require('multer');
const path = require('path');

router.use(authenticateToken);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const originalName = path.parse(file.originalname).name;
        cb(null, originalName + '-' + Date.now() + '.csv');
    }
});

const fileFilter = (req, file, cb) => {
    const filetypes = /csv/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Only .csv files are allowed!'));
};

const upload = multer({ storage, fileFilter });

router.post('/import-StationCsv', upload.single('csvFile'), stationController.importStationCSV);

module.exports = router;
