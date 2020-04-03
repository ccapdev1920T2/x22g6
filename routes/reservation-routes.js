const router = require("express").Router();
const reservationController = require("../controllers/reservation-controller");
const auth = require("../middlewares/auth");

router.use(auth.redirectLogin);

// GET request for my-reservations page
router.get("/my-reservations", auth.checkNonStaff, auth.getUserInfo, reservationController.sendMyReservationsPage);

// POST request for creating a reservation
router.post("/create", auth.checkNonStaff, reservationController.createReservation);

// DELETE request for deleting a reservation
router.delete("/delete", auth.checkNonStaff, reservationController.deleteReservation);

// GET request for user-reservations page
router.get("/user-reservations", auth.checkStaff, auth.getUserInfo, reservationController.sendUserReservationsPage);

// GET request for user-reservations page showing user reservations at a specific date, trip, and time
router.get("/user-reservations/:date/:time/:trip", auth.checkStaff, reservationController.sendUserReservations);

// POST request for checking-in a user
router.post("/check-in", reservationController.checkInUser);

module.exports = router;