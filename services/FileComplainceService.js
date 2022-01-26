const FileComplainceState = require("../models/FileComplainceState")
const RemoveFileComplainceState = (chatId) => {
    return FileComplainceState.remove({ chatId: chatId })
}

const CreateFileComplainceState = (chatId) => {
    return RemoveFileComplainceState(chatId)
        .then(() => {
            const fcState = new FileComplainceState({ chatId });
            return fcState.save();
        })
}

module.exports = {
    RemoveFileComplainceState,
    CreateFileComplainceState
}