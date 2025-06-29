const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: [true, "Email is required"], unique: true },
    password: { type: String },
    profileImageUrl: { type: String, default: "" },
    bio: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    techStack: [{ type: String, default: "" }],
    role: { type: String, default: "Developer" },
    authProvider: {
      type: String,
      enum: ["email", "google", "github"],
      default: "email",
    },
  },
  { timestamps: true }
);

// Hash password if changed
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Match password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
