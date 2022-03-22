const express = require("express");
const board = require("../schemas/board");
const Board = require("../schemas/board");
const router = express.Router();


router.get("/", (req, res) => {
    res.send("thie is root page");
});

// 글 목록 조회
router.get("/board", async (req, res) => {
  const {num} = req.query;

  const board = await Board.find({num});
  res.json({ board });
});

// 글 상세 조회
router.get("/board/:num", async (req, res) =>{
  const {num} = req.params;
  console.log(num);

  const [board] = await Board.find({ num: Number(num) });

  res.json({
    board,
  });
});

// 글 지우기
router.delete("/board/:num", async(req, res) =>{
	const { num } = req.params;	
	const { password } = req.body;

  board.splice(num, 1);
  
	
	const existBoard = await Board.find({num: Number(num), password: password});

	if(existBoard.length){
		await Board.deleteOne({ num: Number(num)});
	}else{
		return res.status(400).json({
			errorMessage: "비밀번호가 다릅니다."
			
		});	
	}

	res.json({success: true});
});

// 글 수정하기
router.put("/board/:num", async (req, res)=>{
	const { num } = req.params;	
	const { title } = req.body;
	const { content } = req.body;
	const { password } = req.body;

	const existBoard = await Board.find({num: Number(num), password: password});	

	if(existBoard.length){
		await Board.updateOne({num: Number(num)}, { $set: {title, content }}) 	
	}else{
		return res.status(400).json({
			errorMessage: "비밀번호가 다릅니다."	
		});	
	}
	
	 res.json({success: true})

});

// 글쓰기!!!!
router.post("/board", async (req, res) => {
	var today = new Date();
	var date = today.toLocaleString()		
	
	const { title, name, password, content } = req.body;	
	console.log({ title, name, password, content })

	let num = 0
	const Post_ls = await Board.find();
	console.log(Post_ls)
	num = Post_ls.length + 1

	const createdBoard = await Board.create({ title, name, password, content, num, date });

	res.json({ board : "등록 완료!!" });
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