import mongoose from "mongoose";

const Item = new mongoose.Schema({
        dept_id: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
        item_name: { type: String, required: true },
        type: { type: String, required: true },
        cost: { type: Number, required: true },
        color: { type: String },
        size: { type: String }
    },
    { timestamps: true }
);

export default mongoose.models.Item || mongoose.model("Item", Item, "Item");
