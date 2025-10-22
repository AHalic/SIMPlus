import mongoose from "mongoose";

const Transaction = new mongoose.Schema({
        transaction_id: { type: int, required: true, unique: true, index: true },
        returned_id: { type: int },
        date_time: { type: String, required: true },
        payment_method: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.models.Transaction || mongoose.model("Transaction", Transaction);
