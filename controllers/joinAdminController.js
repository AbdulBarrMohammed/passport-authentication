const db = require("../db/queries");


async function joinAdminPost(req, res) {
    const  { adminCode } = req.body;
    const {id } = req.user;

    if (adminCode === 'test') {
        await db.updateUserAdmin(id)
        console.log("User is now admin ")
    }
    else {
        console.log("incorrect passcode");
    }
    res.redirect("/");

}

async function joinAdminGet(req, res) {
    res.render("views/adminForm", { user: req.user });
}

module.exports = {
    joinAdminGet,
    joinAdminPost
}
