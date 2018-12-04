const { mongoose } = require("./../mongoose")
const validator = require("validator")
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs');

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

UserSchema.statics.findByToken = function (token) {
  let decoded;

  try {
    decoded = jwt.verify(token, 'abc123')
  } catch (e) {
    return Promise.reject()
  }

  return this.findOneAndUpdate({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

UserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, hash) => {
        this.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

UserSchema.statics.findByCredentials = function (email, password) {
  return this.findOne({ email })
    .then(user => {
      if (!user) {
        return Promise.reject();
      }

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            resolve(user);
          } else {
            reject();
          }
        });
      });
    });
};

const User = mongoose.model("user", UserSchema)

module.exports = { User }