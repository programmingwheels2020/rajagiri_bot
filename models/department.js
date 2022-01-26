const mongoose = require("mongoose")

const DepartmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    building: { type: String }
})

module.exports = mongoose.model("Department", DepartmentSchema);