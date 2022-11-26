const express = require("express");
const {
  register,
  activateAccout,
  login,
  sendVerification,
  getProfile,
  updateProfilePicture,
  addFriend,
  cancelRequest,
  follow,
  unfollow,
  acceptRequest,
  unfriend,
  deleteRequest,
  getFriendsPageInfos,
  search,
  addToSearchHistory,getSearchHistory,removeFromSearch
} = require("../controllers/userController");
const { authUser } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);
router.post("/activate", authUser, activateAccout);
router.post("/login", login);
router.post("/sendVerification", authUser, sendVerification);
router.get("/getProfile/:username", authUser, getProfile);
router.put("/updateProfilePicture", authUser, updateProfilePicture);
router.put("/addFriend/:id", authUser, addFriend);
router.put("/cancelRequest/:id", authUser, cancelRequest);
router.put("/follow/:id", authUser, follow);
router.put("/unfollow/:id", authUser, unfollow);
router.put("/acceptRequest/:id", authUser, acceptRequest);
router.put("/unfriend/:id", authUser, unfriend);
router.put("/deleteRequest/:id", authUser, deleteRequest);
router.get("/getFriendsPageInfos", authUser, getFriendsPageInfos);
router.post("/search/:searchTerm", authUser, search);
router.put("/addToSearchHistory", authUser, addToSearchHistory);
router.put("/removeFromSearch", authUser, removeFromSearch);
router.get("/getSearchHistory", authUser, getSearchHistory);

module.exports = router;
