const express = require("express");
const path = require("path");
const {v4: uuidv4} = require("uuid");
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

app.listen(port, () => {console.log(`Listening at port: ${port}`)});