const ComplainceState = require("../models/complainceState")

const CreateComplainceState = (chatId) => {
    console.log(chatId)
    return ComplainceState.remove({ chatId: chatId })
        .then(() => {
            let complainceState = new ComplainceState();
            complainceState.chatId = chatId
            return complainceState.save();
        })
}

const RemoveComplainceState = (chatId) => {
    return ComplainceState.remove({ chatId: chatId });
}

const GetComplainceState = (chatId) => {
    return ComplainceState.findOne({ chatId: chatId });
}
const SaveComplaince = (complainceObj) => {

}

module.exports = {
    CreateComplainceState,
    RemoveComplainceState,
    GetComplainceState,
    SaveComplaince
}