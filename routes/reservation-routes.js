const router = require("express").Router();
const reservationController = require("../controllers/reservation-controller");
const auth = require("../middlewares/auth");

router.use(auth.redirectLogin);

// GET request for my-reservations page
router.get("/my-reservations", reservationController.sendMyReservationsPage);

// POST request for creating a reservation
router.post("/create", reservationController.createReservation);

// DELETE request for deleting a reservation
router.delete("/delete", (req, res) => res.sendStatus(501));

// GET request for user-reservations page
router.get("/user-reservations", reservationController.sendUserReservationsPage);

// GET request for user-reservations page showing user reservations at a specific date, trip, and time
router.get("/user-reservations/:date/:time/:trip", reservationController.sendUserReservations);

// POST request for checking-in a user
router.post("/check-in", reservationController.checkInUser);

module.exports = router;