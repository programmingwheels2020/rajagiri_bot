const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: { type: String },
    phone: { type: String },
    chatId: { type: Number },
    activatedStatus: { type: Boolean, default: false }
})

module.exports = mongoose.model("User", UserSchema);