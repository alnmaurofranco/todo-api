const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

// Middleware
function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  if (!username)
    return response.status(403).json({ error: "Headers not found" });

  const user = users.find((user) => user.username === username);

  if (!user) return response.status(404).json({ error: "User not found" });

  request.user = user;

  return next();
}

// Create account
app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.find((user) => user.username === username);

  if (userAlreadyExists)
    return response.status(400).json({ error: "User already exists." });

  const data = {
    id: uuid(),
    name,
    username,
    todos: [],
  };

  users.push(data);

  return response.status(201).json(data);
});

// Account
app.get("/user-profile", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  const todos = user.todos;

  if (todos.length <= 0)
    return response.status(404).json({ error: "You have no tasks in moment" });

  return response.json(todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;

  const { user } = request;

  const data = {
    id: uuid(),
    title,
    done: false,
    deadline: new Date(deadline),
    createdAt: new Date(),
  };

  user.todos.push(data);

  return response.status(201).json(data);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) return response.status(404).json({ error: "To-do not found." });

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) return response.status(404).json({ error: "To-do not found." });

  todo.done = true;

  return response.json(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todoIndex = user.todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1)
    return response.status(404).json({ error: "To-do not found." });

  user.todos.splice(todoIndex, 1);

  return response.status(204).json();
});

module.exports = app;
