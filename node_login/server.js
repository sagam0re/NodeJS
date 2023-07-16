const express = require("express");
const app = express();
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
require("dotenv").config();

const port = process.env.PORT || 4000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/users/register", (req, res) => {
  res.render("register");
});
app.get("/users/login", (req, res) => {
  res.render("login");
});
app.get("/users/dashboard", (req, res) => {
  res.render("dashboard", { user: "Sagamore" });
});

app.post("/users/register", async (req, res) => {
  let { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ message: "Enter all fields" });
  }
  if (password.length < 6) {
    errors.push({ message: "Password should be at least 7 characters" });
  }
  if (password != password2) {
    errors.push({ message: "Password didn't match" });
  }
  if (errors.length > 0) {
    res.render("register", { errors });
  } else {
    let hashedPassword = await bcrypt.hash(password, 10);

    pool.query(
      "select * from users where email = $1",
      [email],
      (e, results) => {
        if (e) {
          throw e.message;
        }
        console.log(results.rows);

        if (results.length.rows.length > 0) {
          errors.push({ message: "Email already registered" });
          res.render("register", { errors });
        }
      }
    );
  }
});

app.listen(port, () => console.log(`app is listening on localhost:${port}`));
