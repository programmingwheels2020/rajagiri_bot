const TelegramBot = require('node-telegram-bot-api');
const User = require("./models/user");
const token = '5190648543:AAHJF6Rh6FJNExvUKdapMgWdg47PGJYwTlc';
const bot = new TelegramBot(token, { polling: true });
const { InlineKeyboard, ReplyKeyboard, ForceReply, Row, KeyboardButton, InlineKeyboardButton } = require("node-telegram-keyboard-wrapper");
const callbackQuery = require('./callbackquery');
const Department = require("./models/department");
const { CreateComplainceState, RemoveComplainceState } = require('./services/complainceService');
const ComplainceState = require('./models/complainceState');
const phoneNoState = {};
const Complaince = require('./models/complaince');
const { CreateFileComplainceState, RemoveFileComplainceState } = require('./services/FileComplainceService');
const FileComplainceState = require('./models/FileComplainceState');
const CommonComplaince = require("./models/commonComplaince")
function clearStatus(id) {

    phoneNoState[id] && delete phoneNoState[id]
}
const fetch = require('node-fetch');
const { MongoClient, GridFSBucket } = require("mongodb");
const FileComplaince = require('./models/FileComplaince');
const CommonComplainceState = require('./models/commonComplainceState')
/// Create a new MongoClient
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("rajagiridb");
const bucket = new GridFSBucket(db);
client.connect();
const request = require('request');
const commonComplainceCallbackQuery = require('./commonComplainceCallbackQuery');
const ComplainceType = require('./models/complainceType');
const { CreateCommonComplainceState, RemoveCommonComplainceState } = require('./services/CommonComplainceService');

const download = (url, path, callback) => {
    request.head(url, (err, res, body) => {
        request(url).pipe(bucket.openUploadStream(path, {
            chunkSizeBytes: 1048576,
            metadata: { field: `${path}_field`, value: path }
        })).on('close', callback);
    });
};

bot.onText(/\/phone_no/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = "Please type your mobile number  +919874112233 "
    clearStatus(chatId);
    phoneNoState[chatId] = true;
    bot.sendMessage(chatId, resp);
});

bot.onText(/\/complaince_registration/, async (msg, match) => {
    const chatId = msg.chat.id;
    clearStatus(chatId);
    try {
        await CreateComplainceState(chatId);
        const resp = "Please select the department "
        let departmentList = await Department.find({});
        const inlineKeyboard = new InlineKeyboard();
        for (let i = 0; i < departmentList.length; i++) {
            let lastRow = new Row(
                new InlineKeyboardButton(departmentList[i].name, "callback_data", `complaince_department_${departmentList[i]._id}`)
            )
            inlineKeyboard.push(lastRow);
        }
        const options = {
            reply_markup: inlineKeyboard.getMarkup()
        }
        bot.sendMessage(chatId, resp, options);
    } catch (err) {

    }

});

bot.onText(/\/common_complaince/, async (msg, match) => {
    const chatId = msg.chat.id;
    clearStatus(chatId);
    try {
        await CreateCommonComplainceState(chatId);
        const resp = "Please select the type "
        //let departmentList = await Department.find({});
        let types = await ComplainceType.find({})
        const inlineKeyboard = new InlineKeyboard();
        for (let i = 0; i < types.length; i++) {
            let lastRow = new Row(
                new InlineKeyboardButton(types[i].name, "callback_data", `commoncomplaince_type_${types[i].typeId}`)
            )
            inlineKeyboard.push(lastRow);
        }
        const options = {
            reply_markup: inlineKeyboard.getMarkup()
        }
        bot.sendMessage(chatId, resp, options);
    } catch (err) {
        console.log(err);
    }
})


bot.onText(/\/filing_complaince/, async (msg, match) => {
    const chatId = msg.chat.id;
    clearStatus(chatId);
    try {
        await CreateFileComplainceState(chatId);
        const resp = "Please select the department "
        let departmentList = await Department.find({});
        const inlineKeyboard = new InlineKeyboard();
        for (let i = 0; i < departmentList.length; i++) {
            let lastRow = new Row(
                new InlineKeyboardButton(departmentList[i].name, "callback_data", `filing_department_${departmentList[i]._id}`)
            )
            inlineKeyboard.push(lastRow);
        }
        const options = {
            reply_markup: inlineKeyboard.getMarkup()
        }
        bot.sendMessage(chatId, resp, options);
    } catch (err) {
        console.log(err);
    }

});

callbackQuery(bot);
commonComplainceCallbackQuery(bot);

bot.on('message', async (msg) => {

    try {
        const chatId = msg.chat.id;
        const cmdList = ["/phone_no", "/complaince_registration", "/common_complaince"]
        console.log(msg.text == cmdList[2])
        console.log(cmdList.indexOf(msg.text))
        if (cmdList.indexOf(msg.text) !== -1) {
            consolelog("HHHHHH")
            return;
        }
        if (phoneNoState[chatId]) {
            let user = await User.findOne({ "phone": msg.text })
            if (user) {
                user.chatId = chatId;
                user.activatedStatus = true;
                await user.save();
                delete phoneNoState[chatId]
                let resp = `Hai, ${user.name} , Your mobile number has been updated.`
                bot.sendMessage(chatId, resp);
            } else {
                let resp = `You have entered wrong mobile number. Please try again`
                bot.sendMessage(chatId, resp);
            }
        }

        let complainceState = await ComplainceState.findOne({ chatId: chatId });
        if (complainceState && !complainceState.procedure.length) {
            let proce = msg.text.split(",");
            for (let i = 0; i < proce.length; i++) {
                complainceState.procedure.push(parseInt(proce[i]));
            }
            await complainceState.save();
            let resp = `Please enter the procedure comment now`
            bot.sendMessage(chatId, resp);
            return;

        }
        if (complainceState && complainceState.procedure.length && !complainceState.comment) {

            complainceState.comment = msg.text;
            await complainceState.save();
            let result = await ComplainceState.findOne({ chatId: chatId })
            const complaince = new Complaince({
                department: result.department,
                staff: result.staff,
                procedure: result.procedure,
                comment: result.comment,
                complainceLevel: result.complainceLevel
            })
            await complaince.save();
            await RemoveComplainceState(chatId);
            let resp = `Complaince Saved Successfully. Thanks`
            bot.sendMessage(chatId, resp);

        }
        let fsState = await FileComplainceState.findOne({ chatId: chatId });
        if (fsState && !fsState.comment) {

            fsState.comment = msg.text;
            await fsState.save();
            let resp = `Please upload Image`
            bot.sendMessage(chatId, resp);

        }

        let commonState = await CommonComplainceState.findOne({ chatId: chatId })
        if (commonState && !commonState.comment) {

            commonState.comment = msg.text;
            await commonState.save();
            let resp = `Please upload Image`
            bot.sendMessage(chatId, resp);

        }
    } catch (err) {
        console.log(err.message)
    }


});


bot.on('photo', async (doc) => {
    const chatId = doc.chat.id;
    try {
        let fsState = await FileComplainceState.findOne({ chatId: chatId });
        console.log(fsState)
        console.log("Reached File Uploade");
        if (fsState && !fsState.photo) {
            const fileId = doc.photo[2].file_id;
            console.log("THis is reached");
            // an api request to get the "file directory" (file path)
            console.log(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`)
            const res = await fetch(
                `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`
            );
            // extract the file path
            console.log(res);
            console.log("----------")
            const res2 = await res.json();
            const filePath = res2.result.file_path;

            // now that we've "file path" we can generate the download link
            const downloadURL =
                `https://api.telegram.org/file/bot${token}/${filePath}`;


            let fcomplaince = new FileComplaince({
                staff: fsState.staff,
                department: fsState.department,
                complainceLevel: fsState.complainceLevel,
                comment: fsState.comment,
                photo: `${fileId}.jpg`
            })
            await fcomplaince.save();
            await RemoveFileComplainceState(chatId);
            download(downloadURL, `${fileId}.jpg`, () => {
                let resp = `Successfully Completed File complaince Registration `
                bot.sendMessage(chatId, resp);
            }

            );

        }

        let commonState = await CommonComplainceState.findOne({ chatId: chatId })

        if (commonState && !commonState.photo) {
            const fileId = doc.photo[2].file_id;
            // an api request to get the "file directory" (file path)
            console.log(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`)
            const res = await fetch(
                `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`
            );
            // extract the file path

            const res2 = await res.json();
            const filePath = res2.result.file_path;

            // now that we've "file path" we can generate the download link
            const downloadURL =
                `https://api.telegram.org/file/bot${token}/${filePath}`;


            let commonComplaince = new CommonComplaince({
                type: commonState.type,
                staff: commonState.staff,
                department: commonState.department,
                complainceLevel: commonState.complainceLevel,
                comment: commonState.comment,
                photo: `${fileId}.jpg`
            })
            await commonComplaince.save();
            await RemoveCommonComplainceState(chatId);
            download(downloadURL, `${fileId}.jpg`, () => {
                let resp = `Successfully Completed File complaince Registration `
                bot.sendMessage(chatId, resp);
            }

            );

        }
    } catch (err) {
        console.log(err);
    }


});