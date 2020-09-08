const express = require("express");
const bodyParser = require("body-parser");
const busboyBodyParser = require("busboy-body-parser");
const path = require("path");
const mustache = require("mustache-express");
const mysqlConnetion = require("./connection");
const item = require('./models/item');
const user = require('./models/user');
const routersAuth = require("./routers/auth");
const { userInfo } = require("os");

const app = express();
const Path = path.join(__dirname, "views");

app.engine("mst", mustache());
app.set("views", Path);
app.set("view engine", "mst");

app.use(busboyBodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use("/", routersAuth);

app.get("/", (req, res) => {

    item.getAll().then(items => {
      res.render('index', {items});
    });
  
});

app.get("/register", (req, res) => {
    res.render('register');

});

// app.get("/login", (req, res) => {
//   res.render('login');

// });

// app.post("/login", (req, res) => {
//   console.log(req.body);
//   res.redirect('/');
// });

app.post("/register", (req, res) => {
  user.insert(req.body).then(items => res.redirect('/'));
  console.log(req.body);
});

app.post('/insertToDB', function(req, res) {
  item.insert(req.body.name).then(items => res.redirect('/'));
});

app.post('/deleteFromDB', function(req, res){
  item.delete(req.body.id).then(items => res.redirect('/'));
})

app.post('/updateInDB', function(req, res){
  item.update(req.body.id, req.body.name).then(items => res.redirect('/'));
})
// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
