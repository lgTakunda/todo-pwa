import db from "../../config/db.js";
import bcrypt from "bcryptjs";

const register = (username, password, callback) => {
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return callback(err);
    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hash],
      function (err) {
        if (err) return callback(err);
        callback(null, { id: this.lastID, username });
      }
    );
  });
};

const findByUsername = (username, callback) => {
  db.get("SELECT * FROM users WHERE username = ?", [username], callback);
};

export { register, findByUsername };
