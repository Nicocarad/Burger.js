import express from "express";
import passport from "passport";
import * as controller from "../controllers/user.js";

const router = express.Router();

//Ottenimento di tutti gli utenti
router.get("/", controller.getUsers);

//Renderizzazione della pagina di registrazione del cliente
router.get("/registrazione", (req, res) => {
  res.render("registrazione");
});

//Renderizzazione della pagina di registrazione del cuoco
router.get("/addChef", (req, res) => {
  res.render("registrazioneChef");
});

//Inserimento utente
router.post("/", controller.addUser);

//Login utente
router.post("/login",
  passport.authenticate("local-signup", {
    failureRedirect: "/homepage",
  }),
  (req, res) => {
    switch (req.user.tipo) {
      case "cliente":
        res.redirect("/products");
        break;
      case "admin":
        res.redirect("/products");
        break;
      case "cuoco":
        res.redirect("/orders/all/chefInit");
        break;
      default:
        console.log("Errore di redirezione");
        break;
    }
  }
);

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) { res.send(err); }
    res.redirect("/homepage");
  });
});

export default router;