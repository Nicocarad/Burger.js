import express from "express";
import methodOverride from "method-override";
import * as controller from "../controllers/product.js";

const router = express.Router();

router.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

//Ottenimento di tutti i prodotti
router.get("/", controller.getAllProd);

//Ottenimento di un prodotto in base al nome
router.get("/:id", controller.getProd);

//Inserimento di nuovo prodotto
router.post("/", controller.addProduct);

//Cancellazione prodotto
router.delete("/:id", controller.deleteProd);

//Modifica di un prodotto
router.patch("/:name", controller.updateProd);

export default router;