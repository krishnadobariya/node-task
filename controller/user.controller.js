const User = require("../model/user.model");
const status = require("http-status")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Memer = require("random-jokes-api");
const axios = require("axios")


/* ----- sign up ----- */
exports.userSignUp = async (req, res) => {
    try {

        const checkEmail = await User.findOne({ email: req.body.email })

        if (checkEmail) {

            res.status(status.CONFLICT).json({
                message: "EMAIL ALREADY EXIST!",
                status: 409
            })

        } else {

            const userData = new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                mobile_number: req.body.mobile_number,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null)
            });
            const saveData = await userData.save();

            res.status(status.CREATED).json({
                message: "USER SIGN UP SUCCESSFULLY!",
                status: 201,
                data: saveData,
            })

        }

    } catch (error) {

        console.log("error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WANT WRONG",
            status: 500
        })

    }
}
/* ----- end sign up ----- */


/* ----- sign in ----- */
exports.userSignIn = async (req, res) => {
    try {

        const data = await User.findOne({ email: req.body.email })

        if (data) {

            bcrypt.compare(req.body.password, data.password, async (err, comPass) => {

                if (comPass) {

                    const token = jwt.sign({ _id: data._id.toString() }, process.env.SECRET_KEY);

                    res.cookie("jwt", token, {
                        expires: new Date(Date.now() + 30 * 24 * 3600 * 10000),
                        httpOnly: true,
                    });

                    const updateData = await User.findByIdAndUpdate({ _id: data._id }, {
                        $set: {
                            token: token
                        }
                    })

                    res.status(status.OK).json({
                        message: "USER LOGIN SUCCESSFULLY!",
                        status: 200,
                        token: token
                    })

                } else {

                    res.status(status.UNAUTHORIZED).json({
                        message: "INVAILD CREDENCIAL!",
                        status: 401
                    })

                }

            })

        } else {

            res.status(status.NOT_FOUND).json({
                message: "USER NOT FOUND!",
                status: 404
            })

        }

    } catch (error) {

        console.log("error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WANT WRONG",
            status: 500
        })

    }
}
/* ----- end sign in ----- */


/* ----- view user profile ----- */
exports.viewProfile = async (req, res) => {
    try {

        const id = req.user._id
        const userData = await User.findById({ _id: id });

        if (userData) {

            res.status(status.OK).json({
                message: "USER PROFILE VIEW SUCCESSFULLY",
                status: 200,
                data: userData
            })

        } else {

            res.status(status.NOT_FOUND).json({
                message: "USER NOT EXIST",
                status: 404
            })

        }

    } catch (error) {

        console.log("error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WANT WRONG",
            status: 500
        })

    }
}
/* ----- end view user profile ----- */


/* ----- random jokes ----- */
exports.randomJokes = async (req, res) => {
    try {

        let jokes = Memer.joke();
        console.log("jokes", jokes);

        let url = `https://random-data-api.com/api/v2/users`;
        console.log(url);

        await axios.get(url).then((res1) => {

            console.log("response", res1.data);
            const data = {
                avatar: res1.data.avatar,
                first_name: res1.data.first_name,
                last_name: res1.data.last_name,
                email: res1.data.email,
                phone_number: res1.data.phone_number,
                jokes: jokes
            }

            res.status(200).json({
                message: "GET DATA SUCCESSFULLY",
                status: 200,
                data: data
            })
        }).catch((error) => {
            res.status(500).json({
                message: "SOMETHING WENT WRONG",
                status: 500
            })
        })

    } catch (error) {

        console.log("error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WANT WRONG",
            status: 500
        })

    }
}
/* ----- end random jokes ----- */


/* ----- user logout ----- */
exports.userLogOut = async (req, res) => {
    try {

        const id = req.user._id
        const userData = await User.findById({ _id: id });

        if (userData) {

            const updateData = await User.findByIdAndUpdate({ _id: userData._id }, {
                $unset: {
                    token: ""
                }
            })

            res.status(status.OK).json({
                message: "USER LOG OUT SUCCESSFULLY",
                status: 200
            })

        } else {

            res.status(status.NOT_FOUND).json({
                message: "USER NOT EXIST",
                status: 404
            })

        }

    } catch (error) {

        console.log("error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WANT WRONG",
            status: 500
        })

    }
}
/* ----- end user logout ----- */