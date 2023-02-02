const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.use(express.static("public"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/smothieDB", { useNewUrlParser: true });

const smothieSchema = mongoose.Schema({
    name: String,
    author: String,
    items: []
});

const Smothie = mongoose.model("Smothie", smothieSchema);

const defaultSmothie = new Smothie({
    name: "Banana y durazno",
    author: "Santi Soifer",
    items: ["Banana", "Durazno", "leche"]
});

// defaultSmothie.save();
app.get("/", (req, res) => {
    // Save the default smothie:
    Smothie.findOne({ name: "Banana y durazno", }, (err, foundedSmothie) => {
        if (!err && foundedSmothie === null) {
            defaultSmothie.save();
        } else {
            console.log(err);
        }
    });

    // Render home screen, and pass all the existing smothies.
    Smothie.find({}, (err, results) => {
        if (!err) {
            res.render("index", { smothies: results });
        } else {
            console.log(err);
        }
    });

});

app.get("/create", (req, res) => {
    res.render("create");
});

app.post("/create", (req, res) => {
    
    const {smothieName, authorName, smothieIngredients } = req.body;

    if (smothieName !== "" && authorName !== "" && smothieIngredients !== "") {
        
        const newSmothie = new Smothie({
            name: _.upperFirst(smothieName),
            author: _.upperFirst(authorName),
            items: smothieIngredients.split(",")
        });
    
        newSmothie.save((err) => {
            if (!err) {
                console.log("New smothie saved!");
            } else {
                console.log(err);
            }
        });
    
        res.redirect("/");

    } else {
        res.redirect("/create")
    }
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});