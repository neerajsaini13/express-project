const mongoose = require("mongoose")

// schema  
const reviewSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
    },

}, { timestamps: true })

// model 
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review