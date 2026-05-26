const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, default: null },
    googleId: { type: String, default: null },
    avatar: { type: String, default: null },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.password) return;
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

/* COMPARE PASSWORD */
UserSchema.methods.comparePassword = async function (plainPassword) {
  if (!this.password) return false;
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);