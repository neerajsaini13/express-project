const dotenv = require("dotenv")
dotenv.config()

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3002;
const path = require("path")
const ListingModel = require("./models/Listing")
var methodOverride = require('method-override');
const ExpressError = require("./utils/ExpressError");
const listingRouter = require("./routes/listingRouter");
const reviewRouter = require("./routes/reviewRouter");
const userRouter = require("./routes/userRouter")


var cookieParser = require('cookie-parser');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const UserModel = require("./models/UserModel");
const cloud = require("./config/cloud");

// database connection setup 
async function db() {
    await mongoose.connect("mongodb://127.0.0.1:27017/samyakWeb");
    console.log("connection success");
};
db();


// cloudinary setup 
cloud()


// ejs setup 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// static files serve setup
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));


app.use(cookieParser());




app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}))

// passport configure strategy 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());






app.use((req, res, next) => {
    res.locals.currUser = req.user
    next()
})





// app.get("/err", (req, res) => {
//     throw new ExpressError(400, "somethig went wrong")
// })



// LISTING ROUTER 
app.use("/listings", listingRouter);

// REVIEW ROUTER 
app.use("/listing/:id/review", reviewRouter);

// user router 
app.use("/user", userRouter)




app.get("/set-cookie", (req, res) => {
    res.cookie("name", "mohan");
    res.cookie("product", "mobile");
    res.send("set cookie")
})


app.get("/get-cookie", (req, res) => {
    res.send(`Your Name ${req.cookies.name} Product : ${req.cookies.product}`)
})


// 404 error page ROUTE 
app.get("*", (req, res) => {
    res.render("pagenotfound.ejs")
});




// error handle middleware 

app.use((err, req, res, next) => {
    let { message, statuscode = 500 } = err;
    res.status(statuscode).render("error.ejs", { message });
})



// server start 
app.listen(port, () => {
    console.log("Server Start");
})