import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import bcrypt from "bcrypt";
const userSchema = mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  cognome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  tipo: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  salt: {
    type: String,
  },
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

userSchema.pre("save", function (next) {
  let user = this;
  let userSalt;
  bcrypt
    .genSalt(10)
    .then((salt) => {
      userSalt = salt;
      return bcrypt.hash(user.password, salt);
    })
    .then((hash) => {
      user.password = hash;
      user.salt = userSalt;
      next();
    });
});

userSchema.methods.validPassword = async function (pwd) {
  let valid;
  await bcrypt.compare(pwd, this.password).then((result)=>{
    valid = result;
  });
  return valid;
};

export default mongoose.model("User", userSchema);