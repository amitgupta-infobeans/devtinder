const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      // index: true, we can add this line in place of unique:true
      unique: true, // it will create index automatically for email field.
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid..");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18, // for number we use min and for string we use minLength.
    },
    gender: {
      type: String,
      validate(value) {
        //validate only call when new document is inserted.. but not in case of update document, for update we need to add option in update API.
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("gender data is not valid...");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://fastly.picsum.photos/id/64/4326/2884.jpg?hmac=9_SzX666YRpR_fOyYStXpfSiJ_edO3ghlSRnH2w09Kg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("photo url is not valid..");
        }
      },
    },
    about: {
      type: String,
      default: "This is default value for about",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
