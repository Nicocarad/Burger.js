import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  idCliente: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  idCuoco: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chef",
  },
  products: {
    type: Array,
    required: true,
  },
  prezzo: String,
  stato: {
    type: String,
    default: "Da prendere in carico",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("Order", orderSchema);