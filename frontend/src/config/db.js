import Dexie from "dexie";

const db = new Dexie("TodoDB");
db.version(2).stores({
  // Bump version for schema change
  todos: "++id, text",
  queue: "++id, action, payload",
});

export default db;
