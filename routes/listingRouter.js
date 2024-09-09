const express = require("express");
const ListingModel = require("../models/Listing");
const isLoggedin = require("../middleware/isLoggedin");
const router = express.Router();

const multer = require('multer')
const upload = multer({
    storage: multer.diskStorage({}),
})
const cloudinary = require('cloudinary').v2

router.get("/", async (req, res) => {
    let allListing = await ListingModel.find({});
    // console.log(allListing);
    res.render("listings/index.ejs", { allListing })
});




router.get("/show/:id", async (req, res, next) => {
    const listing = await ListingModel.findById(req.params.id).populate({ path: "reviews", populate: { path: "user" } })
    // console.log(listing);
    if (!listing) {
        return res.send("Listing Id not found")
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing })
})






// CREATE 
router.get("/create", isLoggedin, (req, res) => {
    res.render("listings/create.ejs");
});




router.post("/create", upload.single('image'), async (req, res, next) => {

    let { title, description, price, url, location, country } = req.body;

    if (!title || !description || !price || !location || !country) {
        return next(new ExpressError(404, "Listing required"))
    }


    const lisitng = new ListingModel({
        title,
        description,
        price,
        location,
        country,
    });

    if (req.file !== "undefined") {
        const { public_id, url } = await cloudinary.uploader.upload(req.file.path, { folder: "samyak listing" })
        lisitng.image = { url, public_id }
    }

    await lisitng.save();
    res.redirect("/listings")
})







router.get("/edit/:id", isLoggedin, async (req, res) => {
    let { id } = req.params;
    const lisitng = await ListingModel.findById(id);
    if (!lisitng) {
        return next(ExpressError(404, "Listing id Not found"))
    }
    // console.log(lisitng);
    res.render("listings/edit.ejs", { lisitng })
});








router.put("/edit/:id", isLoggedin, upload.single('image'), async (req, res) => {
    // console.log(req.body);
    // console.log(req.file);
    let { id } = req.params;

    const lisitng = await ListingModel.findById(id);

    await cloudinary.uploader.destroy(lisitng.image.public_id);

    if (req.file !== "undefined") {
        const { public_id, url } = await cloudinary.uploader.upload(req.file.path, { folder: "samyak listing" })
        lisitng.image = { url, public_id }
    }


    await ListingModel.findByIdAndUpdate(id, { ...req.body }, { new: true });

    await lisitng.save();
    res.redirect(`/listings/show/${id}`);
});





// DELETE 
router.delete("/delete/:id", isLoggedin, async (req, res) => {
    let { id } = req.params;
    const listing = await ListingModel.findById(id);
    await cloudinary.uploader.destroy(listing.image.public_id);
    const deleteListing = await ListingModel.findByIdAndDelete(id)
    res.redirect("/listings");
})



module.exports = router;