const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    postNum: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Comment", commentSchema);