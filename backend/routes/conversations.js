const express = require("express");
const { newConversation ,getConversation, findChat} = require("../controllers/conversations");
const { authUser } = require("../middlewares/auth");

const router = express.Router();

router.post("/conversation/",newConversation)
router.get("/conversation/:userId",getConversation)
router.get("/conversation/find/:firstId/:secondId",findChat)

module.exports = router;
