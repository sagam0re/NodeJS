const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");

const initialize = (passport) => {
  const authenticateUsers = (email, password, done) => {
    pool.query(
      "select * from users where email = $1",
      [email],
      (err, results) => {
        if (err) {
          throw err.message;
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          const user = results.rows[0];

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              throw err;
            }
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password is not correct" });
            }
          });
        } else {
          return done(null, false, { message: "Email doesn't registered" });
        }
      }
    );
  };

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      authenticateUsers
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    pool.query("select * from users where id = $1", [id], (err, results) => {
      if (err) {
        throw err.message;
      }
      return done(null, results.rows[0]);
    });
  });
};

module.exports = initialize;
