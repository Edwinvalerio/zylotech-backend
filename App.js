const express = require("express");
const app = express();
const port = 4000;
const bodyParser = require("body-parser");
require("dotenv").config();

var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "199314edwin" //THIS IS YOUR SQL PASSWORD
  //   database: "dogApp"
});

////////////////////////////////////////////////////////////////
//             API HEADER ALLOWE
////////////////////////////////////////////////////////////////

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

/*============================================
    CREATE DATABASE OF DOESN'T EXIST FOR THE DOG APP
============================================*/
const createDataBase = ` CREATE DATABASE IF NOT EXISTS dogApp`;
connection.query(createDataBase, (err, response) => {
  if (err) throw err;
  console.log("Connected to DataBase and DogApp database created");
});

/*============================================
    CREATE TABLE IF DOESN'T EXISTS
============================================*/
connection.query("USE dogApp;", (err, response) => {
  console.log(err);
});

const createFavoriteTable = `CREATE TABLE favorites (id int auto_increment PRIMARY KEY, image_url varchar(255) unique);`;
connection.query(createFavoriteTable, (err, response) => {
  //   if (err) console.log(err);
  console.log("FAFORITE TABLE CREATED");
});
/*============================================
    ADD TO FAVORITE
============================================*/
app.post("/addfavorite", function(req, res) {
  const url = req.body.url;
  console.log(url);
  const addToFavorites = `INSERT INTO favorites (image_url) values('${url}')`;
  connection.query(addToFavorites, (err, response) => {
    // if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
});

/*============================================
    GET FAVORITES
============================================*/
app.get("/getFavorites", function(req, res) {
  connection.query("SELECT * FROM favorites;", (err, response) => {
    res.json(response);
  });
});

/*============================================
    DELETE FAVORITES
============================================*/
app.post("/deletefavorite", function(req, res) {
  const { id } = req.body;
  let deleteQuery = `DELETE FROM favorites WHERE ID=${id} `;
  connection.query(deleteQuery, (err, response) => {
    res.json({ response: response });
  });
});

// EXPRESS LISTENERS
app.listen(port, () => {
  console.log("listening on port: ", port);
});
