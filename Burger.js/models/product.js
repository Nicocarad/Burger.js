import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  nome: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  prezzo: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Product", productSchema);