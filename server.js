const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true })

const Todo = mongoose.model('todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
})

const newTodo = new Todo({
    text: 'First Mongoose Task',
    completed: true,
})

newTodo.save().then(res => console.log(res), err => console.log(err))
