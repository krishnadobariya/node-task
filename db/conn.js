const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

mongoose.connect("mongodb://localhost:27017/node-task")
    .then(() => {
        console.log(`DATABASE CONNECTED`);
        console.log("==========================================================================");
    })
    .catch((err) => {
        console.log(`Database Not Connected`);
    })