const router = require("express").Router();
const scheduleController = require("../controllers/schedule-controller");
const auth = require("../middlewares/auth");

router.use(auth.redirectLogin);

// GET request for the Arrow's Schedule Page
router.get("/", scheduleController.sendArrowsSchedulePage);

// GET request for time-slots for a trip
router.get("/time-slots/:trip", scheduleController.sendTimeSlots);

// GET request for the Arrow's Schedule Page for specific date and trip
router.get("/filter/:date/:trip", scheduleController.sendTimeSlotsWithReservations);

module.exports = router;