const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect(
  "mongodb+srv://skshitiz250:Kshitiz84@cluster0.ebbs0iq.mongodb.net/todolistDB",
  {
    useNewUrlParser: true,
  }
);
const itemsschema = new mongoose.Schema({
  name: String,
});
const Item = mongoose.model("Item", itemsschema);
const item1 = new Item({
  name: "Wlecome to our to-do list app",
});
const item2 = new Item({
  name: "Hit the + button to add a new item",
});
const item3 = new Item({
  name: "<-- Hit this to delete an item",
});
const defaultitems = [item1, item2, item3];
const listschema = mongoose.Schema({
  name: String,
  items: [itemsschema],
});

const List = mongoose.model("List", listschema);

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  // const day = date.getdate();

  const find = async () => {
    const data = await Item.find({});
    if (data.length === 0) {
      Item.insertMany(defaultitems);

      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newlistitem: data });
    }
  };
  find();
});
app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);
  console.log(customListName);

  const findlist = async () => {
    const listname = await List.findOne({ name: customListName }).exec();

    // console.log(listname);
    if (!listname) {
      const list = new List({
        name: customListName,
        items: defaultitems,
      });
      list.save();
      res.redirect("/" + customListName);
    } else {
      res.render("list", {
        listTitle: listname.name,
        newlistitem: listname.items,
      });
    }
  };
  findlist();
});

app.post("/", function (req, res) {
  const itemname = req.body.text;
  const listname = req.body.list;
  const item = new Item({
    name: itemname,
  });
  if (listname === "Today") {
    item.save();
    res.redirect("/");
  } else {
    const findlist = async () => {
      const listname2 = await List.findOne({ name: listname }).exec();
      listname2.items.push(item);
      listname2.save();
      res.redirect("/" + listname2.name);
    };
    findlist();
  }
});
app.post("/delete", function (req, res) {
  const checkedId = req.body.checkbox;
  const listname = req.body.listname;

  if (listname === "Today") {
    const del = async () => {
      await Item.findByIdAndDelete(checkedId);
    };
    del();
    res.redirect("/");
  } else {
    const delete_customlist_item = async () => {
      await List.findOneAndUpdate(
        { name: listname },
        { $pull: { items: { _id: checkedId } } }
      );
    };
    delete_customlist_item();
    res.redirect("/" + listname);
  }
});
app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
