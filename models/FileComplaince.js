const mongoose = require("mongoose")

const FileComplainceSchema = new mongoose.Schema({
    staff: { type: mongoose.Types.ObjectId },
    department: { type: mongoose.Types.ObjectId, required: true },
    complainceLevel: { type: Number, required: true },
    comment: { type: String, required: true },
    photo: { type: String }
}, { timestamps: true })

module.exports = mongoose.model("FileComplaince", FileComplainceSchema);