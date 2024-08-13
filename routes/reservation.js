const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// 예약 생성 API
router.post('/', async (req, res) => {
    const { username, reservation_date } = req.body;

    try {
        // 먼저 같은 날짜, 같은 username으로 예약이 있는지 확인
        const checkQuery = `
      SELECT * FROM calendar 
      WHERE username = $1 AND reservation_date = $2
    `;
        const checkResult = await pool.query(checkQuery, [username, reservation_date]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({
                status: 400,
                message: '같은 날짜에 이미 예약이 존재합니다.',
            });
        }

        // 예약이 없으면 새로운 예약 추가
        const insertQuery = `
      INSERT INTO calendar (username, reservation_date) 
      VALUES ($1, $2) 
      RETURNING *
    `;
        const insertResult = await pool.query(insertQuery, [username, reservation_date]);

        return res.status(201).json({
            status: 201,
            message: '예약이 성공적으로 추가되었습니다.',
            data: insertResult.rows[0],
        });
    } catch (error) {
        console.error('Error creating reservation:', error);
        return res.status(500).json({
            status: 500,
            message: '예약을 생성하는 중에 오류가 발생했습니다.',
            error: error.message,
        });
    }
});

/* GET reservations by date */
router.get('/:date', async function (req, res, next) {
    const reservationDate = req.params.date;

    try {
        // Fetch reservations for the specific date
        const query = 'SELECT * FROM calendar WHERE reservation_date = $1';
        const values = [reservationDate];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'No reservations found for the given date'
            });
        }

        res.status(200).json({
            status: 200,
            data: result.rows,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Failed to retrieve reservations',
            error: error.message,
        });
    }
});

// 예약 취소 API
router.delete('/cancel-reservation', async (req, res) => {
    const { username, reservation_date } = req.body;

    try {
        // 먼저 해당 예약이 존재하는지 확인
        const checkQuery = `
      SELECT * FROM calendar 
      WHERE username = $1 AND reservation_date = $2
    `;
        const checkResult = await pool.query(checkQuery, [username, reservation_date]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({
                status: 404,
                message: '해당 날짜에 예약이 존재하지 않습니다.',
            });
        }

        // 예약이 존재하면 삭제
        const deleteQuery = `
      DELETE FROM calendar 
      WHERE username = $1 AND reservation_date = $2
      RETURNING *
    `;
        const deleteResult = await pool.query(deleteQuery, [username, reservation_date]);

        return res.status(200).json({
            status: 200,
            message: '예약이 성공적으로 취소되었습니다.',
            data: deleteResult.rows[0],
        });
    } catch (error) {
        console.error('Error cancelling reservation:', error);
        return res.status(500).json({
            status: 500,
            message: '예약을 취소하는 중에 오류가 발생했습니다.',
            error: error.message,
        });
    }
});



module.exports = router;
