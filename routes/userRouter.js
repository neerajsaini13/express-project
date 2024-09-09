const express = require("express");
const UserModel = require("../models/UserModel");
const passport = require("passport");
const router = express.Router();



router.get("/signup", (req, res) => {
    res.render("user/signup.ejs")
});


router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.send("All fildes are required");
    }
    const newUser = new UserModel({
        username: username,
        email: email
    });
    await UserModel.register(newUser, password);
    res.redirect('/user/login')
});



router.get("/login", (req, res) => {
    res.render("user/login.ejs")
})


router.post("/login", passport.authenticate("local", { failureRedirect: '/user/signup' }), (req, res) => {
    res.redirect("/listings")
})




router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            res.send(err)
        };

        res.redirect("/listings")
    })
})


module.exports = router;