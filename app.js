require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const e = require("express");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


mongoose.connect("mongodb://127.0.0.1:27017/userDB", function (err) {
    if (!err) {
        console.log("connected to the database");
    } else {
        console.log(err);
    }
})

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);



app.get("/login", function (req, res) {
    res.render("login");
})

app.get("/register", function (req, res) {
    res.render("register");
})

app.get("/", function (req, res) {
    res.render("home");
})

app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save(function (err) {
        if (err) {
            log(err)
        } else {
            res.render("secrets")
        }
    })
})

app.post("/login", function (req, res) {
    username = req.body.username
    password = req.body.password

    User.findOne({ email: username }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {

                if (foundUser.password === password) {
                    res.render("secrets")
                }
            }
        }
    })
})

app.listen("3000", function () {
    console.log("listening on port 3000");
})