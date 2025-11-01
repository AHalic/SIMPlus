import mongoose from "mongoose";

const Stock = new mongoose.Schema({
        item_id: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
        dept_id: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
        amount: { type: Number, required: true }
    },
    { timestamps: true }
);

export default mongoose.models.Stock || mongoose.model("Stock", Stock, "Stock");
