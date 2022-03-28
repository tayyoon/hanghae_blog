const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    nickname: String,
    password: String,
});

// 프론트엔드에서 userId를 참조하고 있기때문에 추가.....??????????
UserSchema.virtual("userId").get(function() {
    return this._id.toHexString();
});

UserSchema.set("toJSON", {
    virtuals: true,
});
module.exports = mongoose.model("User", UserSchema);