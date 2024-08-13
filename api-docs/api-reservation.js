/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 예약 ID
 *         user_id:
 *           type: integer
 *           description: 사용자 ID
 *         username:
 *           type: string
 *           description: 예약자 이름
 *         reservation_dt:
 *           type: string
 *           format: date
 *           description: 예약 날짜
 *       required:
 *         - user_id
 *         - username
 *         - reservation_dt
 */


/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: 예약 생성
 *     description: 새로운 예약을 생성합니다. 동일한 날짜에 같은 사용자가 중복 예약할 수 없으며, 같은 날짜에 최대 두 개의 예약만 가능합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: 예약자 ID
 *               username:
 *                 type: string
 *                 description: 예약자 이름
 *               reservation_dt:
 *                 type: string
 *                 format: date
 *                 description: 예약 날짜 (YYYY-MM-DD)
 *             required:
 *               - user_id
 *               - username
 *               - reservation_dt
 *     responses:
 *       201:
 *         description: 예약이 성공적으로 생성되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: 동일한 날짜에 이미 예약이 존재하거나 예약이 두 개를 초과합니다.
 *       500:
 *         description: 서버 오류로 예약 생성 실패
 */

/**
 * @swagger
 * /reservations/{date}:
 *   get:
 *     summary: 특정 날짜의 예약 조회
 *     description: 특정 날짜에 대한 예약 정보를 조회합니다.
 *     parameters:
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: 예약 날짜 (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: 해당 날짜의 예약 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: 해당 날짜에 예약이 존재하지 않습니다.
 *       500:
 *         description: 서버 오류로 예약 조회 실패
 */


/**
 * @swagger
 * /cancel-reservation:
 *   delete:
 *     summary: 예약 취소
 *     description: 특정 날짜의 예약을 취소합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: 예약자 ID
 *               reservation_dt:
 *                 type: string
 *                 format: date
 *                 description: 예약 날짜 (YYYY-MM-DD)
 *             required:
 *               - user_id
 *               - reservation_dt
 *     responses:
 *       200:
 *         description: 예약이 성공적으로 취소되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: 해당 날짜에 예약이 존재하지 않습니다.
 *       500:
 *         description: 서버 오류로 예약 취소 실패
 */