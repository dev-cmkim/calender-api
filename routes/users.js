var express = require('express');
var router = express.Router();

var pool = require("../db/pool");
const jwt = require('jsonwebtoken');


// 유저조회
router.get("/", function (req, res, next) {
    pool.query("SELECT * FROM users", function (error, result) {
        if (error) {
            throw error;
        }
        res.status(200).json({
            data: result.rows,
        });
    });
});

// 회원가입
router.post("/", async function (req, res, next) {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({
            status: 400,
            message: '이름과 비밀번호는 필수값일세.'
        });
    }

    try {
        // Check if the user already exists
        const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userCheck.rows.length > 0) {
            return res.status(401).json({
                status: 401,
                message: '이미 존재하는 사용자랍니다?'
            });
        }

        // Insert new user
        const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *';
        const values = [username, password];
        const result = await pool.query(query, values);

        res.status(201).json({
            status: 201,
            message: '회원가입 완료!',
            data: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            message: '회원가입 실패!',
            error: error.message
        });
    }

})

const JWT_SECRET = process.env.JWT_SECRET;

// 토큰 체크
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 401,
            message: '토큰 값 빠짐',
        });
    }
    try {
        // Verify the token
        const user = jwt.verify(token, process.env.JWT_SECRET);

        // Verify if the token exists in the database
        const query = 'SELECT * FROM users WHERE user_id = $1 AND token = $2';
        const values = [user.user_id, token];
        const result = await pool.query(query, values);

        console.log(token)
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

// 유저조회 (본인)
router.get('/:user_id', authenticateToken, async function (req, res, next) {
    const userId = parseInt(req.params.user_id);

    // Check if the user_id from the token matches the requested user_id
    if (userId !== req.user.user_id) {
        return res.status(403).json({
            status: 403,
            message: 'Token 을 확인하세요',
        });
    }

    try {
        // Fetch user information from the database
        const query = 'SELECT user_id, username FROM users WHERE user_id = $1';
        const values = [userId];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'User not found',
            });
        }

        res.status(200).json({
            status: 200,
            data: result.rows[0],
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Failed to retrieve user information',
            error: error.message,
        });
    }
});

module.exports = router;
