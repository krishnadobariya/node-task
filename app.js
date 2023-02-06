const express = require("express");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();
require("./db/conn");

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());
app.use(cors());

const usersRouter = require("./router/user.router");

app.use("/users", usersRouter);

app.listen(PORT, () => {
    console.log("==========================================================================");
    console.log(`Server Running At PORT : ${PORT}`);
})