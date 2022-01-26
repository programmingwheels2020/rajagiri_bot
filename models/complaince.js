const mongoose = require("mongoose")

const ComplainceSchema = new mongoose.Schema({
    staff: { type: mongoose.Types.ObjectId },
    department: { type: mongoose.Types.ObjectId, required: true },
    procedure: [Number],
    complainceLevel: { type: Number, required: true },
    comment: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model("Complaince", ComplainceSchema);