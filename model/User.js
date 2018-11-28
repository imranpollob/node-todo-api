const { mongoose } = require("./../mongoose")
const validator = require("validator")
const jwt = require('jsonwebtoken')
const _ = require('lodash')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})

UserSchema.methods.toJSON = function () {
  return _.pick(this.toObject(), ['_id', 'email'])
}

UserSchema.methods.generateAuthToken = function () {
  let access = 'auth'
  let token = jwt.sign({ _id: this._id.toHexString(), access }, 'abc123')

  this.tokens = this.tokens.concat([{ access, token }])

  return this.save().then(() => token)
}

const User = mongoose.model("user", UserSchema)

module.exports = { User }