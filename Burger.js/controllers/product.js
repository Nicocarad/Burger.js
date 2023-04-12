import mongoose from "mongoose";
import Product from "../models/product.js";

//PRODUCTS GET HANDLER - restituisce tutti i documenti prodotto registrati
export const getAllProd = (req, res) => {
  if (req.isAuthenticated()) {
    Product.find({})
      .then((result) => {
        res.locals.prods = result;
        //Render della view corrispondente al tipo di utente che si è loggato
        if (req.user.tipo === "admin") {
          res.render("admin");
        } else if (req.user.tipo === "cliente") {
          res.render("ordine");
        } else {
          res.json({ message: "Tipologia utente non riconosciuta" });
        }
      })
      .catch(() => {
        res.json({ message: "Errore ottenitmento prodotti" });
      });
  } else {
    res.send("<h1>ATTENZIONE! NON SEI AUTENTICATO</h1>");
  }
};

//PRODUCT GET WITH PARAM HANDLER - restituisce un prodotto in base al nome passato
export const getProd = (req, res) => {
  if (req.isAuthenticated()) {
    const { name } = req.params;
    Product.findOne({ nome: name })
      .then((prod) => {
        if (prod !== null) {
          //Restituzione del prodotto trovato
          res.json(prod);
        } else {
          //Renderizza homepage se il nome del prodotto inserito non esiste
          res.render("homepage");
        }
      })
      .catch(() => {
        res.json({ message: "Errore ottenimento prodotto" });
      });
  } else {
    res.send("<h1>ATTENZIONE! NON SEI AUTENTICATO</h1>");
  }
};

//PRODUCT POST HANDLER - inserisce un nuovo documento prodotto
export const addProduct = (req, res) => {
  if (req.isAuthenticated() && req.user.tipo === "admin") {
    //Creazione nuovo oggetto product basato sul modello Product
    const product = new Product({
      nome: req.body.add_food,
      prezzo: req.body.add_price,
      tipo: req.body.tipo,
    });
    //Salvataggio prodotto
    product
      .save()
      .then(() => {
        console.log("Prodotto inserito con successo");
        res.redirect("/products");
      })
      .catch(() => {
        res.json({ message: "Errore nell'aggiunta del prodotto" });
      });
  } else {
    res.send("<h1>ATTENZIONE! NON SEI AUTENTICATO</h1>");
  }
};

//DELETE PRODUCT BY ID HANDLER - cancellazione prodotto utilizzando il nome
export const deleteProd = (req, res) => {
  if (req.isAuthenticated() && req.user.tipo === "admin") {
    Product.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) })
      .then(() => {
        console.log("Prodotto eliminato");
        res.redirect("/products");
      })
      .catch(() => {
        res.json({ message: "Errore cancellazione prodotto" });
      });
  } else {
    res.send("<h1>ATTENZIONE! NON SEI AUTENTICATO</h1>");
  }
};

//PUT PRODUCT HANDLER - Modifica delle informazioni prodotto mediante nome
export const updateProd = async (req, res) => {
  if (req.isAuthenticated() && req.user.tipo === "admin") {
    let success = false;
    let id;
    await Product.findOne({ nome: req.params.name }).then((result) => {
      if (result === null) {
        res.redirect("/homepage");
      } else {
        id = result._id;
      }
    });
    //Modifica del nome
    if (req.body.mod_prod) {
      await Product.updateOne(
        { _id: id },
        { $set: { nome: req.body.mod_prod } }
      )
        .then((log) => {
          console.log("Nome del prodotto modificato con successo");
          success = true;
        })
        .catch(() => {
          res.json({ message: "Errore modifica nome prodotto" });
        });
    }
    //Modifica del prezzo
    if (req.body.mod_price) {
      await Product.updateOne(
        { _id: id },
        { $set: { prezzo: req.body.mod_price } }
      )
        .then((log) => {
          console.log("Prezzo del prodotto modificato con successo");
          success = true;
        })
        .catch(() => {
          res.json({ message: "Errore modifica prezzo prodotto" });
        });
    }
    //Ritorna alla homepage dell'admin se la modifica è avvenuta con successo
    if (success === true) {
      res.redirect("/products");
    }
  } else {
    res.send("<h1>ATTENZIONE! NON SEI AUTENTICATO</h1>");
  }
};