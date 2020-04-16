const router = require("express").Router();
const userController = require("../controllers/user-controller");

router.get("/:token", userController.confirmEmail);

module.exports = router;