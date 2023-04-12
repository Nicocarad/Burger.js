import mongoose from "mongoose";
import Order from "../models/order.js";
import * as stat from "../routes/sse.js";

//Variabile utilizzata per salvare l'ordine fin quando non viene effettuato il pagamento
let buffer;

//Render della view pagamento e salvataggio dell'ordine da inserire in un buffer
export const pay = (req, res) => {
  buffer = req.body;
  res.render("pagamento");
};

//ORDERS GET HANDLER - restituisce tutti i documenti ordine registrati
export const getAllOrders = (req, res) => {
  let { opType } = req.params;
  Order.find({})
    .then((orders) => {
      //Render della view con passaggio del vettore degli ordini
      switch (opType) {
        case "chefInit":
          //Salvataggio del riferimento al cuoco
          res.locals.cook = req.user._id;
          res.render("vediOrdini", { orders });
          break;
        case "transazioni":
          res.render("transazioni", { orders });
          break;
        default:
          res.json({ message: "Errore ottenimento lista ordini" });
      }
    })
    .catch(() => {
      res.json({ message: "Errore ottenimento lista ordini" });
    });
};

//ORDER GET WITH PARAM HANDLER - restituisce un ordine in base all'ObjectID passato
export const getOrder = (req, res) => {
  const { id } = req.params;
  Order.findOne({ _id: id })
    .then((order) => {
      //Restituzione dell'ordine trovato
      res.send(order);
    })
    .catch(() => {
      res.json({ message: "Errore ottenimento prodotto" });
    });
};

//PRODUCT POST HANDLER - inserisce un nuovo documento prodotto
export const addOrder = (req, res) => {
  if (req.isAuthenticated()) {
    //Creazione nuovo oggetto order basato sul modello Order
    const order = new Order({
      idCliente: mongoose.Types.ObjectId(req.user._id),
      products: JSON.parse(buffer.products),
      prezzo: buffer.sum.toString(2),
    });
    order
      .save()
      .then((result) => {
        res.locals.order = result;
        //Salvataggio del riferimento all'utente
        res.locals.utente = req.user.nome;
        //Imposta il nuovo ordine da inviare al cuoco e imposta lo stato come "pending"
        stat.default.setNewOrder(result);
        stat.default.setStatus("pending-order");
        res.render("riepilogoOrdine");
      })
      .catch(() => {
        res.json({ message: "Errore inserimento ordine" });
      });
  } else {
    res.send("<h1>ATTENZIONE! NON SEI AUTENTICATO</h1>");
  }
};

//PATCH ORDER HANDLER - modifica delle informazioni ordine mediante id
export const updateOrder = (req, res) => {
  if (req.isAuthenticated()) {
    const { id } = req.params;
    Order.updateOne(
      { _id: id },
      { $set: { idCuoco: req.body.cook, stato: req.body.status } }
    )
      .then(() => {
        if (req.body.status === "In corso") {
          //Impostazione dell'id in modo da aggiornare esclusivamente lo stato dell'ordine gestito dal cuoco
          stat.default.setID(id);
          stat.default.setStatus("update-order");
        } else if (req.body.status === "Completato") {
          stat.default.setID(id);
          stat.default.setStatus("finish-order");
        }
        //Redirezione al controller per l'ottenimento di tutti gli ordini
        res.redirect("/orders/all/chefInit");
      })
      .catch(() => {
        res.json({ message: "Errore inserimento ordine" });
      });
  } else {
    res.send("<h1>ATTENZIONE! NON SEI AUTENTICATO</h1>");
  }
};