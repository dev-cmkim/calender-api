const express = require('express');
const router = express.Router();
const pool = require('../../db/pool');
var authenticateToken = require('../../middlewares/authenticateToken');

// 예약 생성 API
router.post('/', authenticateToken, async (req, res) => {
    const {user_id, username, reservation_dt} = req.body;

    try {
        // 같은날짜로 예약이 두개 이상인지 확인
        const countQuery = `
            SELECT COUNT(*) AS count
            FROM calendar
            WHERE reservation_dt = $1
        `;
        const countResult = await pool.query(countQuery, [reservation_dt]);
        const reservationCount = parseInt(countResult.rows[0].count, 10);

        if (reservationCount >= 2) {
            return res.status(400).json({
                status: 400,
                message: '같은 날짜에 최대 두 개까지 가능함.',
            });
        }

        // 같은 날짜, 같은 username으로 예약이 있는지 확인
        const checkQuery = `
            SELECT *
            FROM calendar
            WHERE user_id = $1
              AND reservation_dt = $2
        `;
        const checkResult = await pool.query(checkQuery, [user_id, reservation_dt]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({
                status: 400,
                message: '같은 날짜에 이미 예약이 존재함.',
            });
        }

        // 예약이 없으면 새로운 예약 추가
        const insertQuery = `
            INSERT INTO calendar (user_id, username, reservation_dt)
            VALUES ($1, $2, $3) RETURNING *
        `;
        const insertResult = await pool.query(insertQuery, [user_id, username, reservation_dt]);

        return res.status(201).json({
            status: 201,
            message: '예약 성공!.',
            data: insertResult.rows[0],
        });
    } catch (error) {
        console.error('Error creating reservation:', error);
        return res.status(500).json({
            status: 500,
            message: '예약 실패, 오류 발생..',
            error: error.message,
        });
    }
});

/* GET reservations by date */
router.get('/:date', async function (req, res, next) {
    const reservationDate = req.params.date;

    try {
        // Fetch reservations for the specific date
        const query = 'SELECT * FROM calendar WHERE reservation_dt = $1';
        const values = [reservationDate];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 404,
                message: '해당 날짜에 예약이 존재하지 않음.',
            });
        }

        res.status(200).json({
            status: 200,
            data: result.rows,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: '예약 조회 실패!',
            error: error.message,
        });
    }
});

// 예약 취소 API
router.delete('/cancel-reservation', authenticateToken, async (req, res) => {
    const {user_id, reservation_dt} = req.body;

    try {
        // 먼저 해당 예약이 존재하는지 확인
        const checkQuery = `
            SELECT *
            FROM calendar
            WHERE user_id = $1
              AND reservation_dt = $2
        `;

        const checkResult = await pool.query(checkQuery, [user_id, reservation_dt]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({
                status: 404,
                message: '해당 날짜에 예약이 존재하지 않음.',
            });
        }

        // 예약이 존재하면 삭제
        const deleteQuery = `
            DELETE
            FROM calendar
            WHERE user_id = $1
              AND reservation_dt = $2 RETURNING *
        `;
        const deleteResult = await pool.query(deleteQuery, [user_id, reservation_dt]);

        return res.status(200).json({
            status: 200,
            message: '예약취소 성공.',
            data: deleteResult.rows[0],
        });
    } catch (error) {
        console.error('Error cancelling reservation:', error);
        return res.status(500).json({
            status: 500,
            message: '예약취소 실패! 오류발생..',
            error: error.message,
        });
    }
});


module.exports = router;
