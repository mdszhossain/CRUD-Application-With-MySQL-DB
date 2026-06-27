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

// newuser route
app.get("/newuser", (req, res) => {
  res.render("newuser.ejs");
});

// updating new user to database
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

// update user information
app.get("/users/:id/update", (req, res) => {
  let {id} = req.params;
  try {
    let q = `SELECT * FROM users WHERE id = '${id}'`;
    connection.query(q, (err, result) => {
      if(err) throw err;
      let Result = result[0];
      // res.send(Result);
      res.render("update.ejs", {Result})
    });
  } catch(err) {
    console.log("Database Error");
    console.log(err);
  }
}); 

app.patch("/users/:id", (req, res) => {
  let {id} = req.params;
  let {username: newUsername, email: newEmail, password: currentPassword} = req.body;
  try {
    let q = `SELECT  * FROM users WHERE id = '${id}'`;
    connection.query(q, (err, result) => {
      let Result = result[0];
      // res.send(Result);
      // console.log(newUsername, newEmail);
      if(Result.password === currentPassword) {
        try {
          let query = `UPDATE users SET username = '${newUsername}', email = '${newEmail}' WHERE id = '${id}'`;
          connection.query(query, (err, result) => {
            if(err) throw err;
            res.redirect("/users");
          });
        } catch(err) {
          console.log("Database Error");
          console.log(err);
        }
      } else {
        res.render("error.ejs");
      }
    });
  } catch(err) {
    console.log("Database Error");
    console.log(err);
  }
});


// destroy route
app.delete("/users/:id", (req, res) => {
  let {id} = req.params;
  try {
    let q = `DELETE FROM users WHERE id = '${id}'`;
    connection.query(q, (err, result) => {
      if(err) throw err;
      res.redirect("/users");
    })
  } catch(err) {
    console.log("Database Error");
    console.log(err);
  }
});

app.listen(port, () => {console.log(`Listening at port: ${port}`)});