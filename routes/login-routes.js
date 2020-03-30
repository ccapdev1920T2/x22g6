const router = require("express").Router();
const usersController = require("../controllers/user-controller");
const auth = require("../middlewares/auth");

router.use(auth.redirectHome);

// GET request for login page
router.get("/", usersController.sendLoginPage);

//POST request for authenticating user
router.post("/", usersController.logInUser);

module.exports = router;