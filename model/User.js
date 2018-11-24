const { mongoose } = require("./../mongoose");

const User = mongoose.model("user", {
  name: {
    type: String,
    required: true,
    minlength: 1
  }
});

module.exports = { User };
