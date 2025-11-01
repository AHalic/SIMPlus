import mongoose from "mongoose";

const Item_Sold = new mongoose.Schema({
        transaction_id: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction", required: true },
        item_id: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
        amount_sold: { type: Number, required: true }
    },
    { timestamps: true }
);

export default mongoose.models.Item_Sold || mongoose.model("Item_Sold", Item_Sold, "Item_Sold");
