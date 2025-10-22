import mongoose from "mongoose";

const Item = new mongoose.Schema({
        item_id: { type: int, required: true, unique: true, index: true },
        dept_id: { type: int, required: true },
        item_name: { type: String, required: true },
        type: { type: String, required: true },
        cost: { type: int, required: true },
        color: { type: String },
        size: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.Item || mongoose.model("Item", Item);
