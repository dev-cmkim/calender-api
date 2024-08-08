var express = require('express');
var router = express.Router();

var pool = require("../db/pool");

/* GET users listing. */
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

module.exports = router;
