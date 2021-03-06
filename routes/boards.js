const express = require("express");
const jwt = require("jsonwebtoken");
const Board = require("../schemas/board");
const User = require("../schemas/user");
const Comment = require("../schemas/comment"); 
const Joi = require("joi");
const authMiddleware = require("../middlewares/authMiddleware");
const comment = require("../schemas/comment");
const router = express.Router();


router.get("/", (req, res) => {
    res.send("thie is root page");
});

// vailidation
const postUsersSchema = Joi.object({
	nickname: Joi.string().alphanum().min(3).required(),
	password: Joi.string().alphanum().min(4).required(),
	confirmPassword: Joi.string().required(),
  });

// 회원가입
router.post('/users', async (req, res) => {
	const { nickname, password, confirmPassword} = req.body;
	
	if (nickname.length<3){
		res.status(400).send({
			errorMessage: "닉네임은 3자리 이상으로 지정해 주세요.",
		});
		return;
	}
		const existUsers = await User.find({  // 데이터베이스에 겹치는 정보가 있는지를 확인!
		$or: [{ nickname }],
		})
		if (existUsers.length) { 
		res.status(400).send({
			errorMessage: " 중복된 닉네임입니다.",
		});
		return; 
		};
	
	if( password.length<4) {
		res.status(400).send({
			errorMessage: "비밀번호는 4자리 이상으로 지정해주세요."
		});
		return;
	}
	if( password != confirmPassword) {
	  res.status(400).send({
		errorMessage: "비밀번호 두개가 다른뎅~~~?",
	  });
	  return;   // 비밀번호가 맞지 않아서 멈춰야함, 그래서 아래쪽의 코드들이 실행이 안되도 되기때문에 여기서 오류가 나면 return으로 멈춤, 핸들러에서 나가짐
	}
  
	// const existUsers = await User.find({  // 데이터베이스에 겹치는 정보가 있는지를 확인!
	//   $or: [{ nickname }],
	// })
	// if (existUsers.length) { 
	//   res.status(400).send({
	// 	errorMessage: " 중복된 닉네임입니다.",
	//   });
	//   return; 
	// }
	  // 위에서 중복되는게 없고 양식에 맞으면 회원의 정보가 데이터베이스에 저장되도록 한다
	const user = new User({nickname, password});
	await user.save();
  
	res.status(201).send({msg: '회원가입 성공했땅!!!!!'});
  });

// 로그인
router.post('/auth', async (req, res) => {
	const {nickname, password} = req.body;
	

	const user = await User.findOne({ nickname, password}).exec();

	if (!user) {
		res.status(400).send({
			errorMessage: "다시 한번 확인해봐!!!!!!!!!!!",
		});
		return;
	}

	const token = jwt.sign({ userId: user.userId}, "my-secret-key");
	console.log(token)
	res.send({
		msg: "로그인 성공!!!!",
		token,
	});
})

// 글 목록 조회
router.get("/board", async (req, res) => {
  const {num} = req.query;

  const board = await Board.find({num});
  res.json({ board });
});



// 글 상세 조회
router.get("/boards", async (req, res) =>{
//   const {num} = req.params;
  const num = req.query.num;
  console.log(num);
//   const {user} = res.locals;
//   const commentNum = req.body.commentNum; get body 못옴
  const comment = await Comment.find({postNum: Number(num)});
  const board = await Board.find({ num: Number(num) });
	
  res.json({
    board,
	comment,
  });
});

router.get("/board/:num", async (req, res) => {
	const {num} = req.params;

	const [board] = await Board.find({num: Number(num)})
	
	res.json({ board });

})
// 글 지우기
router.delete("/board/:num",authMiddleware, async(req, res) =>{
	const { num } = req.params;	
	const { password } = req.body;
	const postNum = req.params.num;
	const {user} = res.locals;
	
	const existBoard = await Board.find({num: Number(num), password: password});

	if(existBoard.length){
		await Board.deleteOne({ num: Number(num)});
	}else{
		return res.status(400).json({
			errorMessage: "비밀번호가 다릅니다."
			
		});	
	}

	res.json({success: "게시글이 삭제되었습니다."});
});

// 글 수정하기
router.put("/board/:num",authMiddleware, async (req, res)=>{
	const { num } = req.params;	
	const { title } = req.body;
	const { content } = req.body;
	const { name } = req.body; 
	const { password } = req.body;

	const existBoard = await Board.find({num: Number(num), password: password});	

	if(existBoard.length){
		await Board.updateOne({num: Number(num)}, { $set: {title, content, name }}) 	
	}else{
		return res.status(400).json({
			errorMessage: "비밀번호가 다릅니다."	
		});	
	}
	 res.json({success: "게시글이 수정되었습니다."})
});

// 글쓰기!!!!
router.post("/board",authMiddleware, async (req, res) => {
	let today = new Date();
	let date = today.toLocaleString()		
	
	const { title, name, password, content } = req.body;	
	console.log({ title, name, password, content })

	let num = 0
	const Post_ls = await Board.find();
	if(Post_ls.length) {
		num = Post_ls[Post_ls.length-1]['num'] + 1
	}else {
		num = 1
	}

	if( !title || !name || !password || !content) {
		return res.status(400).json({
			errorMessage: "빈칸없이 모두 입력하세요"
		});
	}
	// console.log(Post_ls)
	// num = Post_ls.length + 1

	const createdBoard = await Board.create({ title, name, password, content, num, date });

	res.json({ board : "게시판 글쓰기 완료!!" });
});

  // 댓글조회 (로그인 O)

  router.get("/comment", authMiddleware, async (req, res) =>{
	const {num} = req.query;
	const {user} = res.locals;
	let nickname = user.nickname;
  
	const comment = await Comment.find({postNum: Number(num)});
	const [board] = await Board.find({ num: Number(num) });
  
	res.json({
		user,
	  board,
	  comment,
	});
  });

// 댓글 지우기
router.delete("/comment",authMiddleware, async(req, res) =>{
	// const postNum = req.params.num;
	// console.log(postNum)
	// const {user} = res.locals;
	// let nickname = user.nickname;
	const {commentNum} = req.body;
	
	const existComment = await Comment.find({commentNum: commentNum});

	
	if (existComment.length) {
		await Comment.deleteOne({ commentNum: commentNum});
	}else{
		return;
	}

	res.json({success: "댓글이 삭제되었습니다."});
});


//댓글 수정 가져오기
router.post("/comment", authMiddleware, async (req, res)=>{
	
	const {commentNum} = req.body;

	// const comment = await Comment.find({postNum});
	
	// let nickname = user.nickname;

	const comment = await Comment.find({commentNum: commentNum});	

	// if(existComment.length){
	// 	await Board.updateOne({commentNum: commentNum}, { $set: {comment}}) 	
	// }else{
	// 	return res.status(400).json({
	// 		errorMessage: "뭔가 오류가 있는데용?."	
	// 	});	
	// }
	
	 res.json({
		 comment,
		})
});

//댓글 수정 업데이트하기
router.put("/updatecomment",authMiddleware, async (req, res)=>{
	const { num } = req.params;	
	const { title } = req.body;
	const { content } = req.body;
	const { name } = req.body; 
	const { password } = req.body;
	const {comment, commentNum} = req.body;

	const existComment = await Comment.find({commentNum: commentNum});	

	if(existComment.length){
		await Comment.updateOne({commentNum: commentNum}, { $set: {comment}}) 	
	}else{
		return res.status(400).json({
			errorMessage: "잘못된 접근 입니다!!!"	
		});	
	}
	
	 res.json({success: "댓글이 수정되었습니다."})

});

// 댓글쓰기
router.post("/boards", authMiddleware, async (req, res) => {
	let {postNum} = req.query;

	const {user} = res.locals;
	let nickname = user.nickname;

	const { comment } = req.body;

	if( !comment ) {
		return res.status(400).json({
			errorMessage: "댓글을 작성해주세요."
		});
	}

	// let commentNum = 0
	// const comment_ls = await Comment.find();
	// if(comment_ls.length) {
	// 	commentNum = comment_ls[comment_ls.length-1]['commentNum'] + 1
	// }else {
	// 	commentNum = 1
	// }

	const CryptoJS = require('crypto-js');
	const moment = require('moment');
	require('moment-timezone');
	moment.tz.setDefault('Asia/Seoul');
	const NowDate = String(moment().format('YYYY-MM-DD HH:mm:ss'));
	const commentNum = CryptoJS.SHA256(NowDate)['words'][0];

	const createdComment = await Comment.create({ comment, postNum, nickname, commentNum});

	res.json({ msg : "댓글 등록 완료!!" });

	// comment, date, userId, postNum
})


router.get('/users/me',authMiddleware, async (req, res) => {
	const {user} = res.locals;
	// console.log(user)
	res.send({
		user,
	});
  });


// // 게시판 조회 (전체 글 목록 나오도록)
// router.get("/board", (req, res) => {
//     res.json({
//         posts   // posts: posts  같은이름의 키와 변수라면 객체초기자를 사용할 수 있뜸!!!
//     });
// });

// // 게시글 하나 조회
// router.get("/board/:postsId", (req, res) => {
//     const postsId = req.params.postsId;

//     const [detail] = posts.filter((item) => item.postsId === Number(postsId));

//     res.json({
//         detail, 
//     });
// })

// // 게시글을 생성하는 API
// router.post("/board", async (req, res) => {
//     const {postsId, title, name, password, content, date } = req.body;

//     const posts = await Posts.find({postsId});

//     if( posts.length) {
//         return res.status(400).json({ success: false, errorMessage: "이미 있는 데이터 입니다."});
//     }

//     const createdPosts = await Posts.create({postsId, title, name, password, content, date });

//     res.json({ posts: createdPosts});
// })

module.exports = router;