const mongoose = require("mongoose");

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
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18, // for number we use min and for string we use minLength.
    },
    gender: {
      type: String,
      required: true,
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
