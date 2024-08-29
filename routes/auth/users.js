var express = require('express');
var router = express.Router();

var pool = require("../../db/pool");

var authenticateToken = require('../../middlewares/authenticatetoken')
// 유저조회
router.get("/", function (req, res, next) {
    pool.query("SELECT user_id, username, created_at FROM users", function (error, result) {
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
            message: '이름과 비밀번호는 필수임.'
        });
    }

    try {
        // Check if the user already exists
        const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userCheck.rows.length > 0) {
            return res.status(401).json({
                status: 401,
                message: '이미 존재하는 사용자.'
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

// 유저조회 (본인)
router.get('/:user_id', authenticateToken, async function (req, res, next) {
    const userId = parseInt(req.params.user_id);

    // Check if the user_id from the token matches the requested user_id
    if (userId !== req.user.user_id) {
        return res.status(403).json({
            status: 403,
            message: 'Token 확인 필요.',
        });
    }

    try {
        // Fetch user information from the database
        const query = 'SELECT user_id, username FROM users WHERE user_id = $1';
        const values = [userId];
        const userResult = await pool.query(query, values);

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                status: 404,
                message: '해당 유저가 없음.',
            });
        }

        // 본인 예약 조회
        const user = userResult.rows[0];
        const reservationsQuery = 'SELECT reservation_dt FROM calendar WHERE username = $1';
        const reservationsResult = await pool.query(reservationsQuery, [user.username]);

        res.status(200).json({
            status: 200,
            user: {
                user_id: user.user_id,
                username: user.username,
            },
            reservations: reservationsResult.rows,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: '예약 조회 실패.',
            error: error.message,
        });
    }
});

module.exports = router;
