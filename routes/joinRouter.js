const {Router} = require("express");

const joinClubController = require("../controllers/joinClubController")
const router = Router();


router.get("/memberForm", joinClubController.joinClubGet);
router.post("/memberForm", joinClubController.joinClubPost);

module.exports = router;
