const jwt = require('jsonwebtoken');
const pool = require('../db/pool');
require('dotenv').config();  // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET;

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 401,
            message: '토큰 값 필요.',
        });
    }

    try {
        // Verify the token
        const user = jwt.verify(token, JWT_SECRET);

        // Verify if the token exists in the database
        const query = 'SELECT * FROM users WHERE user_id = $1 AND token = $2';
        const values = [user.user_id, token];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(403).json({
                status: 403,
                message: '유효하지 않은 토큰입니다.',
            });
        }

        // If the token is valid and found in the database, proceed to the next middleware
        req.user = result.rows[0];
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message);
        return res.status(403).json({
            status: 403,
            message: '토큰 검증 실패',
        });
    }
}

module.exports = authenticateToken;
