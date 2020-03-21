const router = require("express").Router();
const reservationController = require("../controllers/reservation-controller");

// GET request for my-reservations page
router.get("/my-reservations", reservationController.sendMyReservationsPage);

// POST request for creating a reservation
router.post("/create", (req, res) => res.sendStatus(501));

// DELETE request for deleting a reservation
router.delete("/delete", (req, res) => res.sendStatus(501));

// GET request for time-slots for a path
router.get("/time-slots/:location", (req, res) => res.sendStatus(501));

// GET request for user-reservations page
router.get("/user-reservations", reservationController.sendUserReservationsPage);

// GET request for user-reservations page showing user reservations at a specific date, trip, and time
router.get("/user-reservations/:date/:time/:trip", (req, res) => res.sendStatus(501));

// POST request for checking-in a user
router.post("/check-in", (req, res) => res.sendStatus(501));

module.exports = router;