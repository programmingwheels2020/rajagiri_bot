const Department = require("../models/department");
const Staff = require("../models/staff");
const Procedure = require("../models/procedure");
const Complaince = require("../models/complaince");
const getDepartment = async (req, res) => {
    try {
        const departments = await Department.find({});
        return res.json(departments)
    } catch (err) {
        return res.status(500).json({ errMsg: err.message });
    }
}

const getStaffByDepartment = async (req, res) => {
    try {
        const staffs = await Staff.find({ department: req.params.departmentId });
        return res.json(staffs)
    } catch (err) {
        return res.status(500).json({ errMsg: err.message });
    }
}

const getProcedures = async (req, res) => {
    try {
        const procedures = await Procedure.find({});
        return res.json(procedures)
    } catch (err) {
        return res.status(500).json({ errMsg: err.message });
    }
}

const registerComplaince = async (req, res) => {
    console.log("Reached complaince level");
    try {
        const complaince = new Complaince(req.body);
        await complaince.save();
        return res.json({ message: "successfully sent" })
    } catch (err) {
        return res.status(500).json({ errMsg: err.message });
    }
}
module.exports = {
    getDepartment,
    getStaffByDepartment,
    getProcedures,
    registerComplaince
}