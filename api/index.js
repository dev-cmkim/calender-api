// api/index.js
const app = require('../app'); // 기존 app.js 파일 로드

// 포트 및 서버 설정
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
