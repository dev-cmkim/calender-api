const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/auth/users');
const loginRouter = require('./routes/auth/login');
const testRouter = require('./routes/test');
const reservationRouter = require('./routes/calender/reservation');

// Swagger 설정 추가
const { swaggerUi, swaggerSpec } = require("./swagger");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS 설정
const corsOptions = {
  origin: '*', // 해당 URL 주소만 요청을 허락함
  credentials: true // 사용자 인증이 필요한 리소스를 요청할 수 있도록 허용함
}
app.use(cors(corsOptions)) // cors 설정 미들웨어

// Swagger API 문서화 미들웨어 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/reservation',reservationRouter )
app.use('/test', testRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// 에러 핸들러
app.use((err, req, res, next) => {
  // 로컬 변수 설정, 개발 환경에서만 에러 메시지를 제공
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 에러 페이지 렌더링
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: res.locals.error
  });
});


module.exports = app;
