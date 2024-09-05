const {Router} = require("express");

const joinAdminController = require("../controllers/joinAdminController")
const router = Router();


router.get("/adminForm", joinAdminController.joinAdminGet);
router.post("/adminForm", joinAdminController.joinAdminPost);

module.exports = router;
