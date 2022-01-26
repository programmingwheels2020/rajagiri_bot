const mongoose = require("mongoose")

const ComplainceTypeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    typeId: { type: Number }
})

module.exports = mongoose.model("ComplainceType", ComplainceTypeSchema);