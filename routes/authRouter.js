const {Router} = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");

const router = Router();



router.get("/", authController.displayIndex)
router.get("/dashboard", authController.displayDashboard);
router.get("/sign-up", authController.signUpGet);
router.post("/sign-up", authController.signUpPost);
router.post("/log-in", authController.logInPost);
router.get("/log-out", authController.logOutGet);



module.exports = router;
