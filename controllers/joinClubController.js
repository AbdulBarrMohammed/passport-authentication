const db = require("../db/queries");


async function joinClubPost(req, res) {
    const  { passcode } = req.body;
    const { membership_status } = req.user;
    const {id } = req.user;

    if (passcode === 'test') {
        await db.updateUserMembership(id)
        console.log("User has logged in ")
    }
    else {
        console.log("incorrect passcode");
    }


    console.log(membership_status);
    console.log("look out above")
    res.redirect("/");

}

async function joinClubGet(req, res) {
    res.render("views/memberForm", { user: req.user });
}

module.exports = {
    joinClubGet,
    joinClubPost
}
