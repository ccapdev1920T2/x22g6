const router = require("express").Router();
const scheduleController = require("../controllers/schedule-controller");

// GET request for the Arrow's Schedule Page
router.get("/", scheduleController.sendArrowsSchedulePage);

// GET request for the Arrow's Schedule Page for specific date and path
router.get("/:date/:trip", (req, res) => res.status(501).send("NOT IMPLEMENTED"));

module.exports = router;