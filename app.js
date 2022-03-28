const express = require("express"); // 설치한 express 패키지 모듈을 가져와서 express 변수에 담겠다.
const mongoose = require("mongoose");
const router = express.Router();
const db = require("./schemas/index");
const User = require("./schemas/user");
const app = express();  // express를 함수처럼 실행한 것, 서버객체가 app변수에 담긴것이다. 이렇게만 써야한다.. 
const authMiddleware = require("./middlewares/authMiddleware"); // 사용자인증 미들웨어 불러오기
const port = 3000;


// mongoose.connect("mongodb://localhost:27017/spa_board", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
db();
// const mongoose = require("mongoose");

// const connect = () => {
//     mongoose.connect("mongodb://localhost:27017/spa_board", {ignoreUndefined: true})
//     .catch((err) => { console.error(err); });
// };

// module.exports = connect;


// app.listen(8080, () => {
//   console.log("서버가 요청을 받을 준비가 됐어요");
// });

const boardsRouter = require("./routes/boards");

// 미들웨어
const requestMiddleware = (req, res, next) => {
    console.log("Request URL:", req.originalUrl, " - ", new Date());
    next();
}               // 함수로 만들어서 아래 미들웨어에서 바로 변수를 불러서 사용

app.use(express.static("static"));
app.use(express.urlencoded());
app.use(express.json());
app.use(requestMiddleware);

app.use("/api", boardsRouter);
// app.use("/api", express.urlencoded({ extended: false }), router);

// 라우터 부분 -> 라우터도 미들웨어이긴 함..
// 메인 화면에 보여지는 화면

// router.post('/register', async (req, res) => {
//   const { nickname, password, confirmPassword} = req.body;

//   if( password != confirmPassword) {
//     res.status(400).send({
//       errorMessage: "비밀번호 두개가 다른뎅~~~?",
//     });
//     return;   // 비밀번호가 맞지 않아서 멈춰야함, 그래서 아래쪽의 코드들이 실행이 안되도 되기때문에 여기서 오류가 나면 return으로 멈춤, 핸들러에서 나가짐
//   }

//   const existUsers = await User.find({  // 데이터베이스에 겹치는 정보가 있는지를 확인!
//     $or: [{ nickname }],
//   })
//   if (existUsers.length) { 
//     res.status(400).send({
//       errorMessage: " 중복인데~~~~? 있는데~~~?",
//     });
//     return; 
//   }
//     // 위에서 중복되는게 없고 양식에 맞으면 회원의 정보가 데이터베이스에 저장되도록 한다
//   const user = new User({nickname, password});
//   await user.save();

//   res.status(201).send({});
// });
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/board.html')
  }); 

  app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/static/login.html')
  }); 

  app.get('/write', (req, res) => {
    res.sendFile(__dirname + '/static/write.html')
  });

  app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/static/register.html')
  });

  app.get('/board', (req, res) => {
    res.sendFile(__dirname + '/static/view.html')
  });

  app.get('/board/edit', (req, res) => {
    res.sendFile(__dirname + '/static/edit.html')
  });

app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌다!!!");
});


