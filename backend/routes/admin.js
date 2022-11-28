const express = require("express");
const { adminLogin,adminRegister,getAllUsers,blockUser } = require("../controllers/admin");
const { authAdmin } = require("../middlewares/auth");

const router = express.Router();

router.post("/adminRegister", adminRegister);
router.post("/admin/adminLogin", adminLogin);
router.get("/admin/getAllUsers",authAdmin, getAllUsers);
router.put("/admin/blockUser",authAdmin, blockUser);

module.exports = router;
