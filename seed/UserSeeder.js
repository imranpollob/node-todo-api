const { User } = require('./../model/User')

let create = function (email, password) {
    const newUser = new User({ email, password });

    newUser.save()
        .then(() => console.log(newUser))
        .catch(err => console.log(err))
}

let users = [
    {
        email: 'a@a.com',
        password: 123456
    },
    {
        email: 'b@a.com',
        password: 123456
    },
    {
        email: 'c@a.com',
        password: 123456
    },
    {
        email: 'd@a.com',
        password: 123456
    }
]

users.forEach(obj => {
    create(obj.email, obj.password)
});