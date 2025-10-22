import mongoose from "mongoose";

const Item_Sold = new mongoose.Schema({
        sell_id: { type: int, required: true, unique: true, index: true },
        transaction_id: { type: Number, required: true },
        item_id: { type: int, required: true },
        amount_sold: { type: Number, required: true }
    },
    { timestamps: true }
);

export default mongoose.models.Item_Sold || mongoose.model("Item_Sold", Item_Sold);
