import express from "express";
import methodOverride from "method-override";
import * as controller from "../controllers/order.js";
const router = express.Router();

router.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

//Ottenimento di tutti gli ordini
router.get("/all/:opType", controller.getAllOrders);

//Ottenimento di un ordine in base al id
router.get("/:id", controller.getOrder);

//Inserimento di nuovo ordine
router.post("/", controller.addOrder);

//pagamento simulato
router.post("/pagamento", controller.pay);

//Aggiornamento di un ordine in base al id
router.patch("/:id", controller.updateOrder);

export default router;