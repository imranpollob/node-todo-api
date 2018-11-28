const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')

let msg = {
    id: 4,
    msg: 'My name is khan'
}
let hash = SHA256(JSON.stringify(msg) + 'salt')

console.log(hash)

let token = jwt.sign(JSON.stringify(msg), 'salt')
let decoded = jwt.verify(token, 'salt')

console.log(token.toString(), decoded)