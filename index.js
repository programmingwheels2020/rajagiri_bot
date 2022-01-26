const express = require("express")
require("dotenv").config();
const mongoose = require("mongoose");
const port = process.env.PORT || 4000
const bodyParser = require("body-parser");
const { getDepartment, getStaffByDepartment, getProcedures, registerComplaince } = require("./controllers");
mongoose.connect(process.env.MONGO_URI);
const cors = require("cors")
require("./rajagiriBot");

const app = express();

app.use(bodyParser.json());

app.use(cors());
app.get("/departments", getDepartment);
app.get("/staff/:departmentId", getStaffByDepartment);
app.get("/procedures", getProcedures);
app.post("/register-complaince", registerComplaince);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})
