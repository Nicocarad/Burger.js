import express from "express";
const router = express.Router();
//VARIABILI GLOBALI
// -> Memorizzazione stato dell'ordine
let status;
// -> ID ordine di cui aggiornare lo stato
let orderID;
// -> Oggetto nuovo ordine da inserire nella view cuoco
let newOrder = undefined;

//SETTAGGIO DEGLI HEADER PER SSE
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "text/event-stream",
  "Connection": "keep-alive",
  "Cache-Control": "no-cache",
};

//SETTER variabili globali
function setStatus(stat) {
  status = stat;
}

function setID(ID) {
  orderID = ID;
}

function setNewOrder(ord) {
  newOrder = ord;
}

//GESTIONE DEGLI SSE VERSO IL CLIENTE - Si occupa dell'aggiornamento dello stato
router.get("/tocustomer", (req, res) => {
  res.writeHead(200, headers);
  let e;
  if (status === "update-order") {
    e = `event: ${status}\nretry: 1000\ndata: {"state":"InCorso","orderID":"${orderID}"}`;
  } else if (status === "finish-order") {
    e = `event: ${status}\nretry: 1000\ndata: {"state":"Concluso","orderID":"${orderID}"}`;
  } else {
    e = `event: pending-order\nretry: 1000\ndata: {"state":"In Preparazione"}`;
  }
  res.end(`${e}\n\n`);
});

//GESTIONE DEGLI SSE VERSO IL CUOCO - Si occupa di inviare tutte le informazioni del nuovo ordine inserito dal cliente
router.get("/tocook", (req, res) => {
  res.writeHead(200, headers);
  let e;
  //L'oggetto ordine di default non è valorizzato
  if (newOrder === undefined) {
    e = "event: default\nretry: 1000\ndata:{'state':'default'}";
    //Quando un nuovo ordine è valorizzato viene inviato come SSE alla view del cuoco
  } else {
    e = "event: new-order\nretry: 1000\ndata:{'state':'newOrder'}";
    //Dopo la valorizzazione dell'evento l'oggetto nel nuovo ordine viene resettato
    newOrder = undefined;
  }
  res.end(`${e}\n\n`);
});

//Utilizzo res.end perche la connessione viene terminata ma il client riconnetterà nuovamente per verificare la presenza di nuovo evento
export default { router, setStatus, setID, setNewOrder };