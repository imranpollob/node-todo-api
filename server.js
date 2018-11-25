const express = require('express')
const bodyParser = require('body-parser')

const { Todo } = require("./model/Todo");
const { User } = require("./model/User");

const app = express()
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Ok')
})

app.get('/todos', (req, res) => {
  Todo.find().then(todos => res.send({ todos }), err => res.status(404).send(err))
})

app.post('/todos', (req, res) => {
  const newTodo = new Todo({
    text: req.body.text
  });

  newTodo.save().then(doc => res.send(doc), err => res.status(422).send(err));
})

app.post('/users', (req, res) => {
  const newUser = new User({
    name: req.body.name
  });

  newUser.save().then(doc => res.send(doc), err => res.status(422).send(err));
})

app.listen(5000, () => console.log('Server started on port 5000...'))