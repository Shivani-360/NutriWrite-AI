const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      // Not required: OAuth-only users never set a password
      minlength: 6,
      select: false, // never return password by default
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    // OAuth fields
    githubId: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Hash password before saving (only if it was modified)
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare plain password with hashed one
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false; // OAuth-only account, no password set
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);