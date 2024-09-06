const { format } = require('date-fns');
const db = require('../db/queries');



async function createMessagePost(req, res) {
    const {title, text } = req.body;
    console.log('user below')
    console.log(req.user);
    const time = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    const { username } = req.user
    await db.insertNewMessage({title, text, username, time})
    res.redirect("/");
}

async function createMessageGet(req, res) {
    res.render("views/createMessage")
}

async function messageDeletePost(req, res) {

    console.log("deleted message");
    db.deleteMessage(req.params.id);
    res.redirect("/");
}



module.exports = {
    createMessageGet,
    createMessagePost,
    messageDeletePost
}
