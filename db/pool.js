const { Pool } = require('pg');

const pool = new Pool({
    host: '34.134.7.195',    // Google Cloud PostgreSQL의 공용 IP 주소
    port: 5432,              // 기본 포트 번호
    database: 'postgres',
    user: 'coldme',
    password: 'qwer123$',
    ssl: {
        rejectUnauthorized: false,  // 필요에 따라 SSL 설정 (기본적으로 false로 설정)
    },
});
module.exports = pool