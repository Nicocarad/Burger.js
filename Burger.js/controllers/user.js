import User from "../models/user.js";

//USERS GET HANDLER - restituisce tutti i documenti utente registrati
export const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.json({ message: "Errore ottenimento utenti" });
    });
};

//USER POST HANDLER - inserisce un nuovo documento utente
export const addUser = (req, res) => {
  //Creazione nuovo oggetto user basato sul modello User
  const user = new User({
    nome: req.body.nome,
    cognome: req.body.cognome,
    email: req.body.email,
    password: req.body.password,
    tipo: req.body.tipo,
  });
  if (user) {
    user
      .save()
      .then(() => {
        //Render della view corrispondente dopo la registrazione di un nuovo utente
        if (user.tipo === "cuoco") {
          res.render("registrazioneChef");
        } else if (user.tipo === "cliente") {
          res.render("homepage");
        } else {
          res.json({ message: "Tipologia utente non riconosciuta" });
        }
      })
      .catch(() => {
        res.json({ message: "Errore registrazione utente" });
      });
  }
};

export const userLogout = (req, res) => {
  req.logout();
  res.redirect("/homepage");
};