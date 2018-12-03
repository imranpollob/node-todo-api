const { Todo } = require("./../model/Todo");

let create = function (text) {
    const newTodo = new Todo({ text });

    newTodo.save().then(doc => console.log(doc), err => console.log(err))
}

let todos = [
    {
        text: 'first'
    },
    {
        text: 'second'
    },

    {
        text: 'third'
    },

    {
        text: 'fourth'
    },

    {
        text: 'fifth'
    }
]

todos.forEach(obj => {
    create(obj.text)
});


