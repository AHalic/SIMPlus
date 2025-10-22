import mongoose from "mongoose";

const Stock = new mongoose.Schema({
        item_id: { type: int, required: true },
        amount: { type: Number, required: true }
    },
    { timestamps: true }
);

export default mongoose.models.Stock || mongoose.model("Stock", Stock);
