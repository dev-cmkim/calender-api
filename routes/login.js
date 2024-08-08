var express = require('express');
var router = express.Router();
var pool = require('../db/pool');
var jwt = require('jsonwebtoken');
require('dotenv').config();  // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

/* POST login */
router.post("/", async function (req, res, next) {
    const { username, password } = req.body;

    // Check for missing fields
    if (!username || !password) {
        return res.status(400).json({
            status: 400,
            message: '이름과 비밀번호는 필수값일세.'
        });
    }

    try {
        // Verify user credentials
        const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
        const values = [username, password];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(401).json({
                status: 401,
                message: '이름 or 비밀번호를 다시한번 츄라이..'
            });
        }

        // Generate JWT token
        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
            expiresIn: '30d'  // 토큰만료기간 30일
        });

        res.status(200).json({
            status: 200,
            message: 'Login successful',
            data: {
                user: user,
                token: token
            }
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Failed to authenticate user',
            error: error.message
        });
    }
});

module.exports = router;
