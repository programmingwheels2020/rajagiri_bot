const mongoose = require("mongoose")

const FileComplainceStateSchema = new mongoose.Schema({
    chatId: { type: Number },
    department: { type: String },
    staff: { type: String },
    complainceLevel: { type: Number },
    comment: { type: String },
    photo: { type: String }
})

module.exports = mongoose.model("FileComplainceState", FileComplainceStateSchema);