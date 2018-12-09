const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");

const { Todo } = require("./model/Todo");
const { User } = require("./model/User");
const { authenticate } = require('./middleware/authenticate')

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("ok");
});

app.get("/todos", authenticate, (req, res) => {
  Todo.find({ _creator: req.user._id }).then(todos => res.send({ todos }), err => res.status(404).send(err));
});

app.get("/todos/:id", authenticate, (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send("Invalid Id");
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then(
    todo => {
      if (!todo) {
        return res.status(404).send("No match found");
      }
      return res.send({ todo });
    },
    err => res.status(400).send(err)
  );
});

app.post("/todos", authenticate, (req, res) => {
  const newTodo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  newTodo.save().then(doc => res.send(doc), err => res.status(422).send(err));
});

app.delete("/todos/:id", authenticate, (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send("Invalid Id");
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then(
    todo => {
      if (!todo) {
        return res.status(404).send("No match found");
      }
      return res.send({ todo });
    },
    err => res.status(400).send(err)
  );
});

app.patch("/todos/:id", authenticate, (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['text', 'completed'])

  if (!ObjectID.isValid(id)) {
    return res.status(404).send("Invalid Id");
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false
    body.completedAt = null
  }

  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  },
    { $set: body },
    { new: true })
    .then(todo => {
      if (!todo) {
        return res.status(404).send("No match found");
      }
      return res.send({ todo });
    })
    .catch(err => res.status(400).send(err))
});

app.post("/users", (req, res) => {
  let body = _.pick(req.body, ['email', 'password'])
  const newUser = new User(body);

  newUser.save()
    .then(() => newUser.generateAuthToken())
    .then(token => res.header('x-auth', token).send(newUser))
    .catch(err => res.status(422).send(err))
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password)
    .then((user) => {
      return user.generateAuthToken()
        .then((token) => res.header('x-auth', token).send(user))
    })
    .catch(err => res.status(400).send());
});

app.delete('/logout', authenticate, (req, res) => {
  req.user.removeToken(req.token)
    .then(() => res.status(200).send())
    .catch(err => res.status(400).send());
});

app.listen(5000, () => console.log("Server started on port 5000..."));
