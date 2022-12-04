const express = require("express");
const { adminLogin,adminRegister,getAllUsers,blockUser,getAllPosts } = require("../controllers/admin");
const { authAdmin } = require("../middlewares/auth");

const router = express.Router();

router.post("/adminRegister", adminRegister);
router.post("/admin/adminLogin", adminLogin);
router.get("/admin/getAllUsers",authAdmin, getAllUsers);
router.put("/admin/blockUser",authAdmin, blockUser);
router.get("/admin/getAllPosts",authAdmin,getAllPosts)

module.exports = router;
