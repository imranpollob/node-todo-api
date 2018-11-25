const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");

const { Todo } = require("./model/Todo");
const { User } = require("./model/User");

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("ok");
});

app.get("/todos", (req, res) => {
  Todo.find().then(todos => res.send({ todos }), err => res.status(404).send(err));
});

app.get("/todos/:id", (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send("Invalid Id");
  }

  Todo.findById(id).then(
    todo => {
      if (!todo) {
        return res.status(404).send("No match found");
      }
      return res.send({ todo });
    },
    err => res.status(400).send(err)
  );
});

app.post("/todos", (req, res) => {
  const newTodo = new Todo({
    text: req.body.text
  });

  newTodo.save().then(doc => res.send(doc), err => res.status(422).send(err));
});

app.delete("/todos/:id", (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send("Invalid Id");
  }

  Todo.findByIdAndDelete(id).then(
    todo => {
      if (!todo) {
        return res.status(404).send("No match found");
      }
      return res.send({ todo });
    },
    err => res.status(400).send(err)
  );
});

app.post("/users", (req, res) => {
  const newUser = new User({
    name: req.body.name
  });

  newUser.save().then(doc => res.send(doc), err => res.status(422).send(err));
});

app.listen(5000, () => console.log("Server started on port 5000..."));
