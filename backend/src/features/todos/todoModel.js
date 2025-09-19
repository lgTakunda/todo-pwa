import db from "../../config/db.js";

const createOne = (text, userId, callback) => {
  db.run(
    "INSERT INTO todos (text, user_id) VALUES (?, ?)",
    [text, userId],
    function (err) {
      if (err) return callback(err);
      db.get(
        `
      SELECT todos.*, users.username 
      FROM todos 
      JOIN users ON todos.user_id = users.id 
      WHERE todos.id = ?
    `,
        [this.lastID],
        callback
      );
    }
  );
};

const readAll = (userId, callback) => {
  db.all(
    `
    SELECT todos.*, users.username 
    FROM todos 
    JOIN users ON todos.user_id = users.id 
    WHERE todos.user_id = ?
  `,
    [userId],
    callback
  );
};

const updateOne = (id, text, userId, callback) => {
  db.run(
    "UPDATE todos SET text = ? WHERE id = ? AND user_id = ?",
    [text, id, userId],
    (err) => {
      if (err) return callback(err);
      db.get(
        `
        SELECT todos.*, users.username 
        FROM todos 
        JOIN users ON todos.user_id = users.id 
        WHERE todos.id = ?
      `,
        [id],
        callback
      );
    }
  );
};

const deleteOne = (id, userId, callback) => {
  db.run(
    "DELETE FROM todos WHERE id = ? AND user_id = ?",
    [id, userId],
    callback
  );
};

export { createOne, readAll, updateOne, deleteOne };
