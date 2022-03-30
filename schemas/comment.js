const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    commentNum: {
        type: Number,
        required: true,
    },
    postNum: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("Comment", commentSchema);