const router = require("express").Router();
const usersController = require("../controllers/user-controller");
const auth = require("../middlewares/auth");

router.use(auth.redirectLogin);

// GET request for profile page
router.get("/", auth.getUserInfo, usersController.sendProfilePage);

// POST request for changing user password
router.post("/change-password", auth.getUserInfo, usersController.changeUserPassword);

// POST request for editing profile information
router.post("/edit", auth.getUserInfo, usersController.editProfile);

module.exports = router;