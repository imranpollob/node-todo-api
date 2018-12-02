const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

let msg = {
    id: 4,
    msg: 'My name is khan'
}

// console.log(SHA256(JSON.stringify(msg) + 'salt'))

let token = jwt.sign(JSON.stringify(msg), 'salt')
let decoded = jwt.verify(token, 'salt')

// console.log(token.toString(), decoded)

let hash = '';

bcrypt.genSalt(10, (err, salt) => {
    console.log('salt', salt)
    bcrypt.hash('pass', salt, (err, hash) => {
        console.log('hash', hash)
        hash = hash
    })
})

bcrypt.compare('pass', hash).then(res => {
    console.log('res', res)
})
