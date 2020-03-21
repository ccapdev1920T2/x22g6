const router = require("express").Router();
const usersController = require("../controllers/user-controller");

// GET request for profile page
router.get("/", usersController.sendProfilePage);

// POST request for changing user password
router.post("/change-password", (req, res) => res.sendStatus(501));

// POST request for editing profile information
router.post("/edit", (req, res) => res.sendStatus(501));

module.exports = router;