const express = require("express");
const bodyParser = require("body-parser");
const busboyBodyParser = require("busboy-body-parser");
const path = require("path");
const mustache = require("mustache-express");
const mysqlConnetion = require("./connection");
const item = require('./models/item');

const app = express();
const Path = path.join(__dirname, "views");

app.engine("mst", mustache());
app.set("views", Path);
app.set("view engine", "mst");

app.use(busboyBodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {

    item.update(2, 'hi').then(response => {
        item.getAll().then(items => res.send(items));
    });
  
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
