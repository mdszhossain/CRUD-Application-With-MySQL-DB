const express = require("express");
const path = require("path");
const {v4: uuidv4} = require("uuid");
const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const methodOverride = require("method-override");
const app = express();
const port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'crud_app',
  password: 'shazbrick110',
});


// let createRandomUser = () => {
//   return [
//     faker.string.uuid(),
//     faker.internet.username(),
//     faker.internet.email(),
//     faker.internet.password(),
//   ];
// };

// let data = [];
// for(let i = 0; i < 10; i++) {
//   data[i] = createRandomUser();
// }

// try {
//   let q = "INSERT INTO users (id, username, email, password) VALUES ?";
//   connection.query(q, [data], (err, result) => {
//     if(err) throw err;
//   });
// } catch(err) {
//   console.log("Database Error");
//   console.log(err);
// }

// endpoints
// index route (users)
app.get('/users', (req, res) => {
  try {
    let q = "SELECT * FROM users";
    connection.query(q, (err, result) => {
      if(err) throw err;
      // res.send(result);
      res.render("users.ejs", {result});
    });
  } catch(err) {
    console.log("Database Error");
    console.log(err);
  }
});

app.get("/newuser", (req, res) => {
  res.render("newuser.ejs");
});

app.post("/users", (req, res) => {
  let id = uuidv4()
  let {username, email, password} = req.body;
  let user = [id, username, email, password];
  try {
    let q = "INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)";
    connection.query(q, user, (err, result) => {
      if(err) throw err;
      res.redirect("/users");
    });
  } catch(err) {
    console.log("Database Error");
    console.log(err);
  }
});

app.listen(port, () => {console.log(`Listening at port: ${port}`)});