const mongoose = require("mongoose");
const data = require("./data");
const ListingModel = require("../models/Listing");

console.log(data.sampleListings);

async function db() {
    await mongoose.connect("mongodb://127.0.0.1:27017/samyakWeb");
    console.log("connection success");
};


db();




async function AddData() {
    await ListingModel.insertMany(data.sampleListings);
    console.log("data intialize");
};

AddData();


