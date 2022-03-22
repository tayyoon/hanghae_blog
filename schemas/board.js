const mongoose = require("mongoose");

const boardSchema = mongoose.Schema({
    num: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        require: true,
    },
    date: {
        type: String,
        required: true,
    }
    
});

module.exports = mongoose.model("Board", boardSchema);