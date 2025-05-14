import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: false,
    },
    college: {
      type: String,
      required: true,
      enum: ['ZIBACAR', 'ZCOER', 'ZIMCA', 'Zeal Polytechnic', 'Zeal ITI']
    },
    mobile: {
      type: String,
      required: false,
    },
    collegeID: {
      type: String,
      required: false,
    },
    dob: {
      type: Date,
      required: false,
    },
    role: {
      type: String,
      default: "user",
    },
    mainrole: {
      type: String,
      default: "user",
    },
    subscription: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
      },
    ],
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", schema);
