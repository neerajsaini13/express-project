const express = require("express");
const Review = require("../models/ReviewModel");
const ListingModel = require("../models/Listing");
const isLoggedin = require("../middleware/isLoggedin");
const router = express.Router({ mergeParams: true });


router.post("/create", isLoggedin, async (req, res) => {

    const listing = await ListingModel.findById(req.params.id);

    const review = new Review({
        user: req.user._id,
        rating: req.body.rating,
        comment: req.body.comment,
    });


    listing.reviews.push(review);
    await review.save();
    await listing.save();
    res.redirect(`/listings/show/${listing._id}`);
});






router.delete("/:rid/delete", isLoggedin, async (req, res) => {
    // await Review.findByIdAndDelete()
    // console.log(req.params);
    try {
        await Review.findByIdAndDelete(req.params.rid);
        res.redirect(`/listings/show/${req.params.id}`)
    } catch (error) {
        res.send({ message: error.message })
    }
})




module.exports = router;