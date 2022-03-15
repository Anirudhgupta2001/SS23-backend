const mongoose = require('mongoose')
const Schema = mongoose.Schema
// const passportLocalMongoose = require('passport-local-mongoose')
const Events = require('./event');
const crypto = require("crypto");
const uuidv1 = require('uuid').v1;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name : {
        type: String,
        required : true
    },
    encry_password: {
        type: String,
        required: true,
      },
    salt: String,
    mobile : {
        type : String,
        required: true,
        unique: true
    },
    college : {
        type: String,
        required: false
    },
    level : {
        type : String,
        required: false
    },
    wishlist : [
        {
            type: Schema.Types.ObjectId,
            ref : 'Events'
        }
    ],
    events : [
        {
            type : Schema.Types.ObjectId,
            ref: 'Events'
        }
    ],
    ended : [
        {
            type : Schema.Types.ObjectId,
            ref: 'Events'
        }
    ],
},
{ timestamps: true }
)

UserSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

UserSchema.methods = {
  autheticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },

  securePassword: function (plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

module.exports = mongoose.model('User', UserSchema)