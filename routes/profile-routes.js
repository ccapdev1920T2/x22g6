const router = require("express").Router();
const usersController = require("../controllers/user-controller");

// GET request for profile page
router.get("/", usersController.sendProfilePage);

// POST request for changing user password
router.post("/change-password", usersController.changeUserPassword);

// POST request for editing profile information
router.post("/edit", usersController.editProfile);

module.exports = router;