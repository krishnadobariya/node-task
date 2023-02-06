const router = require("express").Router();
const verify = require("../middleware/auth")

const {
    userSignUp,
    userSignIn,
    viewProfile,
    userLogOut,
    randomJokes
} = require("../controller/user.controller");

router.post("/signup", userSignUp);
router.post("/signin", userSignIn);
router.get("/me", verify, viewProfile);
router.get("/logout", verify, userLogOut);
router.get("/random-joke", randomJokes)

module.exports = router;