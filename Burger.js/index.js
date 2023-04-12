import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRouter from "./routes/users.js";
import prodRouter from "./routes/products.js";
import ordRouter from "./routes/orders.js";
import * as sseRouter from "./routes/sse.js";
import User from "./models/user.js";
import passport from "passport";
import passLocal from "passport-local";

const app = express();
const localStrategy = passLocal.Strategy;
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/public", express.static("public"));
app.use(cookieParser());

//Definizione parametri sessione
app.use(
  session({
    secret: "Ed è motoreiiiiiii...eeeeh, AZIONE!",
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    saveUninitialized: true,
    resave: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Definizione della local strategy necessaria per il login
passport.use(
  "local-signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req, username, password, done) {
      User.findOne({ email: username }, async function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Username errato" });
        }
        let status;
        await user.validPassword(password).then((value) => {
          if (!value) {
            status = done(null, false, { message: "Password errata" });
          } else {
            status = done(null, user);
          }
        });
        return status;
      });
    }
  )
);


//Middleware per il render della home
app.get("/homepage", (req, res) => {
  res.render("homepage");
});

app.use("/users", userRouter);
app.use("/products", prodRouter);
app.use("/orders", ordRouter);
app.use("/updates", sseRouter.default.router);

//Connessione al database
mongoose.connect(
  "/* inserire qua la stringa */"
  //modello stringa: mongodb+srv://USERNAME:PASSWORD@cluster0.h7gedjo.mongodb.net/NOMEDATABASE
);
mongoose.connection.on("open", () => {
  console.log("Connesso al database");
});
mongoose.connection.on("error", () => {
  console.log("Errore nella connessione al database");
});

//App in ascolto
app.listen(PORT, () => console.log(`Server in ascolto alla porta ${PORT}`));