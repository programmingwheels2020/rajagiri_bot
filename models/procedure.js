const mongoose = require("mongoose")

const ProcedureSchema = new mongoose.Schema({
    name: { type: String, required: true }
})

module.exports = mongoose.model("Procedure", ProcedureSchema);