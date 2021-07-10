const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

// 3 default Items
// const exercise = new Item({
//   name: "Exercise",
// });

// const read = new Item({
//   name: "Reading Book",
// });

// const code = new Item({
//   name: "Continue the course",
// });

// const defaultItems = [exercise, read, code];

// Item.insertMany(defaultItems, function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Default items added successfully");
//   }
// });

const items = [];
const workItems = [];

app.get("/", function (req, res) {
  Item.find({}, function (err, results) {
    if (err) {
      console.log(err);
    } else {
      res.render("list", { listTitle: "Today", newListItems: results });
    }
  });
});

app.post("/", function (req, res) {
  let item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
