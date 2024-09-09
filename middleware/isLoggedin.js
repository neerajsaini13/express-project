module.exports = (req, res, next) => {
    if (req.isAuthenticated() === false) {
        return res.redirect("/user/login")
    }

    next()
}