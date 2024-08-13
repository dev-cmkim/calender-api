var express = require('express');
var router = express.Router();
var pool = require('../db/pool');
var jwt = require('jsonwebtoken');
require('dotenv').config();  // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET;

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
        const token = jwt.sign({ user_id: user.user_id, username: user.username }, JWT_SECRET, {
            expiresIn: '30d'  // 토큰만료기간 30일
        });

        try {
            const updateQuery = 'UPDATE users SET token = $1 WHERE user_id = $2';
            await pool.query(updateQuery, [token, user.user_id]);

        } catch (error) {
            console.error('Error during token update:', error.message);
            return res.status(500).json({
                status: 500,
                message: '토큰 저장에 실패했습니다.',
                error: error.message
            });
        }

        res.status(200).json({
            status: 200,
            message: '로그인 성공!',
            data: {
                user: user,
            }
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            message: '로그인 실패!',
            error: error.message
        });
    }
});

module.exports = router;
