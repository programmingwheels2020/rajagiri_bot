const ComplainceState = require("./models/complainceState")
const FileComplainceState = require("./models/FileComplainceState")
const { InlineKeyboard, Row, InlineKeyboardButton } = require("node-telegram-keyboard-wrapper");
const Staff = require("./models/staff");
const callbackQuery = async (bot) => {
    bot.on("callback_query", async (query) => {
        await bot.answerCallbackQuery(query.id, { text: "Action received!" })
        let queryDataStr = query.data.split('_');
        if (queryDataStr[0] === "complaince") {
            let complainceState = await ComplainceState.findOne({ chatId: query.from.id })
            if (queryDataStr[1] == "department") {
                complainceState.department = queryDataStr[2]
                await complainceState.save();
                let userList = await Staff.find({}).sort({ "name": 1 });
                const inlineKeyboard = new InlineKeyboard();
                for (let i = 0; i < userList.length; i++) {
                    if (i % 2 == 0 && i < userList.length - 1) {
                        let myRow = new Row(
                            new InlineKeyboardButton(userList[i].name, "callback_data", `complaince_staff_${userList[i]._id}`),
                            new InlineKeyboardButton(userList[i + 1].name, "callback_data", `complaince_staff_${userList[i + 1]._id}`)
                        )
                        inlineKeyboard.push(myRow);
                    }
                    if (i == userList.length - 1) {
                        let lastRow = new Row(
                            new InlineKeyboardButton(userList[i].name, "callback_data", `complaince_staff_${userList[i]._id}`)
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
                complainceState.staff = queryDataStr[2]
                await complainceState.save();
                const inlineKeyboard = new InlineKeyboard();
                let lastRow = new Row(
                    new InlineKeyboardButton("1", "callback_data", `complaince_level_1`),
                    new InlineKeyboardButton("2", "callback_data", `complaince_level_2`),
                    new InlineKeyboardButton("3", "callback_data", `complaince_level_3`),
                    new InlineKeyboardButton("4", "callback_data", `complaince_level_4`),
                    new InlineKeyboardButton("5", "callback_data", `complaince_level_5`)
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
                complainceState.complainceLevel = queryDataStr[2]
                await complainceState.save();
                let resp = `Please select the procedure name from the list 
                 --------------------
                 1.Administration of Oral Medication
                 2.Administration of IV Injections
                 3.Adminstration of IV infusions
                 4.Blood Sampling
                 5.IV cannulation
                 ---------------------
                 Please type numbers in comma separated for eg 1,3,4
                 `;
                //bot.sendMessage(msg.from.id, "This is a message with an inline keyboard.", options);
                bot.sendMessage(query.from.id, resp);
            }

        }

        if (queryDataStr[0] === "filing") {
            let fsState = await FileComplainceState.findOne({ chatId: query.from.id })
            if (queryDataStr[1] == "department") {
                fsState.department = queryDataStr[2]
                await fsState.save();
                let userList = await Staff.find({ department: queryDataStr[2] }).sort({ "name": 1 });
                const inlineKeyboard = new InlineKeyboard();
                for (let i = 0; i < userList.length; i++) {
                    if (i % 2 == 0 && i < userList.length - 1) {
                        let myRow = new Row(
                            new InlineKeyboardButton(userList[i].name, "callback_data", `filing_staff_${userList[i]._id}`),
                            new InlineKeyboardButton(userList[i + 1].name, "callback_data", `filing_staff_${userList[i + 1]._id}`)
                        )
                        inlineKeyboard.push(myRow);
                    }
                    if (i == userList.length - 1) {
                        let lastRow = new Row(
                            new InlineKeyboardButton(userList[i].name, "callback_data", `filing_staff_${userList[i]._id}`)
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
                fsState.staff = queryDataStr[2]
                await fsState.save();
                const inlineKeyboard = new InlineKeyboard();
                let lastRow = new Row(
                    new InlineKeyboardButton("1", "callback_data", `filing_level_1`),
                    new InlineKeyboardButton("2", "callback_data", `filing_level_2`),
                    new InlineKeyboardButton("3", "callback_data", `filing_level_3`),
                    new InlineKeyboardButton("4", "callback_data", `filing_level_4`),
                    new InlineKeyboardButton("5", "callback_data", `filing_level_5`)
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
                fsState.complainceLevel = queryDataStr[2]
                await fsState.save();
                let resp = `Please enter the File Complaince comment now`;

                //bot.sendMessage(msg.from.id, "This is a message with an inline keyboard.", options);
                bot.sendMessage(query.from.id, resp,)
            }
        }

    });
}

module.exports = callbackQuery