/////// app.js


const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const authRouter = require("./routes/authRouter");
const joinRouter = require("./routes/joinRouter");
const messegeRouter = require("./routes/messageRouter");
const adminRouter = require("./routes/adminRouter");
const { add } = require("date-fns");

const app = express();
app.set("views", __dirname);
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use("/", authRouter);
app.use("/", joinRouter);
app.use("/", messegeRouter);
app.use("/", adminRouter)
module.exports = { passport };



app.listen(4001, () => console.log("app listening on port 4001!"));
