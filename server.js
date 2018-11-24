const { Todo } = require("./model/Todo");
const { User } = require("./model/User");

const newTodo = new Todo({
  text: "First Mongoose Task"
});

const newUser = new User({
  name: "Pollob"
});

newTodo.save().then(res => console.log(res), err => console.log(err));
newUser.save().then(res => console.log(res), err => console.log(err));
