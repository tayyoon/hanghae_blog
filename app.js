const express = require("express"); // 설치한 express 패키지 모듈을 가져와서 express 변수에 담겠다.
const connect = require("./schemas")
const app = express();  // express를 함수처럼 실행한 것, 서버객체가 app변수에 담긴것이다. 이렇게만 써야한다.. 
const port = 3000;

connect();

const boardsRouter = require("./routes/boards");

// 미들웨어
const requestMiddleware = (req, res, next) => {
    console.log("Request URL:", res.originalUrl, " - ", new Date());
    next();
}               // 함수로 만들어서 아래 미들웨어에서 바로 변수를 불러서 사용

app.use(express.static("static"));
app.use(express.urlencoded());
app.use(express.json());
app.use(requestMiddleware);

app.use("/api", boardsRouter);

// 라우터 부분 -> 라우터도 미들웨어이긴 함..
// 메인 화면에 보여지는 화면
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/board.html')
  }); 
  
  app.get('/write', (req, res) => {
    res.sendFile(__dirname + '/static/write.html')
  });
  
  app.get('/board', (req, res) => {
    res.sendFile(__dirname + '/static/view.html')
  });

app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌다!!!");
});
