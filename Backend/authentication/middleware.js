const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        req.user = user;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.roleId === 1) {
        return next();
    } else {
        return res.status(403).json({ error: 'Unauthorized' });
    }
};


const isManager = (req, res, next) => {
    if (req.user && (req.user.roleId === 1 || req.user.roleId === 2)) {
        return next();
    } else {
        return res.status(403).json({ error: 'Unauthorized' });
    }
};


module.exports = {
    authenticateToken,
    isAdmin,
    isManager,
};
