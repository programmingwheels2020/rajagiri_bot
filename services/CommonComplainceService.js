const CommonComplainceState = require("../models/commonComplainceState")

const RemoveCommonComplainceState = (chatId) => {
    return CommonComplainceState.remove({ chatId: chatId })
}

const CreateCommonComplainceState = (chatId) => {
    return RemoveCommonComplainceState(chatId)
        .then(() => {
            const commonState = new CommonComplainceState({ chatId });
            return commonState.save();
        })
}

module.exports = {
    CreateCommonComplainceState,
    RemoveCommonComplainceState
}