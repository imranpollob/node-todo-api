const { mongoose } = require("./../mongoose");
const validator = require("validator")

const User = mongoose.model("user", {
  email: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minLength: 6
  },
  token: {
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true 
    }
  }
});

module.exports = { User };
