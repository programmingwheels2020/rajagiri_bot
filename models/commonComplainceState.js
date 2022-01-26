const mongoose = require("mongoose")

const CommonComplainceStateSchema = new mongoose.Schema({
    type: { type: Number },
    chatId: { type: Number },
    department: { type: String },
    staff: { type: String },
    complainceLevel: { type: Number },
    comment: { type: String },
    photo: { type: String }
})

module.exports = mongoose.model("CommonComplainceState", CommonComplainceStateSchema);