const router = require("express").Router();
const userController = require("../controllers/user-controller");
const auth = require("../middlewares/auth");

router.use("/student", auth.redirectHome);
router.use("/professor", auth.redirectLogin);

// GET request for student registration page
router.get("/student", userController.sendStudentRegistrationPage);

// POST request for registering a new student
router.post("/student", userController.registerStudent);

module.exports = router;