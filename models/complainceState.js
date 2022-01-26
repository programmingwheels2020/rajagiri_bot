const mongoose = require("mongoose")

const ComplainceStateSchema = new mongoose.Schema({
    chatId: { type: Number },
    department: { type: String },
    staff: { type: String },
    procedure: [Number],
    complainceLevel: { type: Number },
    comment: { type: String }
})

module.exports = mongoose.model("ComplainceState", ComplainceStateSchema);