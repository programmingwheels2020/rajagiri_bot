const ComplainceState = require("./models/complainceState")
const FileComplainceState = require("./models/FileComplainceState")
const { InlineKeyboard, Row, InlineKeyboardButton } = require("node-telegram-keyboard-wrapper");
const Staff = require("./models/staff");
const Department = require("./models/department")
const CommonComplainceState = require("./models/commonComplainceState")
const { CreateCommonComplainceState } = require("./services/CommonComplainceService");
const commonComplainceCallbackQuery = async (bot) => {
    bot.on("callback_query", async (query) => {
        let queryDataStr = query.data.split('_');
        console.log(queryDataStr);
        if (queryDataStr[0] == "commoncomplaince") {
            await bot.answerCallbackQuery(query.id, { text: "Action received!" })
            let commonComplainceState = await CommonComplainceState.findOne({ chatId: query.from.id })
            if (queryDataStr[1] == "type") {
                commonComplainceState.type = queryDataStr[2];
                await commonComplainceState.save();
                const resp = "Please select the department "
                let departmentList = await Department.find({});
                const inlineKeyboard = new InlineKeyboard();
                for (let i = 0; i < departmentList.length; i++) {
                    let lastRow = new Row(
                        new InlineKeyboardButton(departmentList[i].name, "callback_data", `commoncomplaince_department_${departmentList[i]._id}`)
                    )
                    inlineKeyboard.push(lastRow);
                }
                const options = {
                    reply_markup: inlineKeyboard.getMarkup()
                }
                await bot.sendMessage(query.from.id, resp, options);
            }
            if (queryDataStr[1] == "department") {
                commonComplainceState.department = queryDataStr[2];
                await commonComplainceState.save();
                let userList = await Staff.find({}).sort({ "name": 1 });
                const inlineKeyboard = new InlineKeyboard();
                for (let i = 0; i < userList.length; i++) {
                    if (i % 2 == 0 && i < userList.length - 1) {
                        let myRow = new Row(
                            new InlineKeyboardButton(userList[i].name, "callback_data", `commoncomplaince_staff_${userList[i]._id}`),
                            new InlineKeyboardButton(userList[i + 1].name, "callback_data", `commoncomplaince_staff_${userList[i + 1]._id}`)
                        )
                        inlineKeyboard.push(myRow);
                    }
                    if (i == userList.length - 1) {
                        let lastRow = new Row(
                            new InlineKeyboardButton(userList[i].name, "callback_data", `commoncomplaince_staff_${userList[i]._id}`)
                        )
                        inlineKeyboard.push(lastRow);
                    }


                }
                const options = {
                    reply_markup: inlineKeyboard.getMarkup()
                }
                let resp = `Please select the staff name`;
                //bot.sendMessage(msg.from.id, "This is a message with an inline keyboard.", options);
                bot.sendMessage(query.from.id, resp, options);
            }
            if (queryDataStr[1] == "staff") {
                commonComplainceState.staff = queryDataStr[2];
                await commonComplainceState.save();
                const inlineKeyboard = new InlineKeyboard();
                let lastRow = new Row(
                    new InlineKeyboardButton("1", "callback_data", `commoncomplaince_level_1`),
                    new InlineKeyboardButton("2", "callback_data", `commoncomplaince_level_2`),
                    new InlineKeyboardButton("3", "callback_data", `commoncomplaince_level_3`),
                    new InlineKeyboardButton("4", "callback_data", `commoncomplaince_level_4`),
                    new InlineKeyboardButton("5", "callback_data", `commoncomplaince_level_5`)
                )
                inlineKeyboard.push(lastRow);
                const options = {
                    reply_markup: inlineKeyboard.getMarkup()
                }
                let resp = `Please select the Complaince  Level`;
                //bot.sendMessage(msg.from.id, "This is a message with an inline keyboard.", options);
                bot.sendMessage(query.from.id, resp, options)

            }
            if (queryDataStr[1] == "level") {
                commonComplainceState.complainceLevel = queryDataStr[2];
                await commonComplainceState.save();
                let resp = `Please enter the Complaince comment now`;

                //bot.sendMessage(msg.from.id, "This is a message with an inline keyboard.", options);
                bot.sendMessage(query.from.id, resp,)
            }

        }

    })
}

module.exports = commonComplainceCallbackQuery