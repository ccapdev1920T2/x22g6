const router = require("express").Router();
const userController = require("../controllers/user-controller");

// GET request for student registration page
router.get("/student", userController.sendStudentRegistrationPage);

// POST request for registering a new student
router.post("/student", userController.registerStudent);

// GET request for professor registration page
router.get("/professor", userController.sendProfessorRegistrationPage);

// POST request for registering a new professor
router.post("/professor", userController.registerProfessor);

module.exports = router;