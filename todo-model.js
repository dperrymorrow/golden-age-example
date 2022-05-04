const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const DB_FOLDER = path.join(__dirname, "db");
const CREATE_TODOS = fs.readFileSync(`${DB_FOLDER}/create-todos.sql`, "utf-8");

const db = new sqlite3.Database(`${DB_FOLDER}/todos_database.db`, err => {
  if (err) {
    console.error("Erro opening database " + err.message);
  } else {
    db.run(CREATE_TODOS, console.log);
  }
});

module.exports = {

  findAll (user, { sortOn, sortDir, search } = {}) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM todos 
      WHERE userId = ? 
      ${search ? `AND UPPER (title) LIKE '%${search.toUpperCase()}%'` : ""} 
      ORDER BY ${sortOn} ${sortDir};`;

      db.all(query, [user.id], (err, todos) => {
        if (err) reject(err);
        else resolve(todos);
      });
    });
  },

  find (user, id) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM todos WHERE userId = ? AND id = ?", [user.id, id], (err, todo) => {
        if (err) reject(err);
        else resolve(todo);
      });
    });
  },

  update (user, todo) {
    const { title, description, id, complete } = todo;

    return new Promise((resolve, reject) => {
      db.run("UPDATE todos SET title = ?, description = ?, modified = ?, complete = ? WHERE id = ? AND userId = ?",
        [title, description, new Date(), complete, id, user.id],
        (err, result) => {
          if (err) reject(err);
          else resolve();
        });
    });
  },

  destroy (user, id) {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM todos WHERE id = ? AND userId = ?",
        id, user.id,
        err => {
          if (err) {
            console.log("there was an error", err);
            reject(err);
          } else resolve();
        });
    });
  },

  create (user, todo) {
    return new Promise((resolve, reject) => {
      const { title, description } = todo;

      db.run("INSERT INTO todos (title, description, userId, created, modified) VALUES (?,?,?,?,?)",
        [title, description, user.id, new Date(), new Date()],
        err => {
          if (err) reject(err);
          else resolve();
        });
    });
  }

};
