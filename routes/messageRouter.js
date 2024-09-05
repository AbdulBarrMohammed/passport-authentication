const { Router } = require("express");
const messageController = require("../controllers/messageController");
const messegeRouter = Router();


messegeRouter.post("/message/create", messageController.createMessagePost);
messegeRouter.get("/message/create", messageController.createMessageGet);
messegeRouter.post("/message/delete/:id", messageController.messageDeletePost);


module.exports = messegeRouter
