const express = require('express')
const bodyParser = require('body-parser')

const { Todo } = require("./model/Todo");
const { User } = require("./model/User");

const app = express()
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Ok')
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

app.listen(5000, () => console.log('Server starting on port 5000...'))