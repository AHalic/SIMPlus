import mongoose from "mongoose";

const Transaction = new mongoose.Schema({
        returned_id: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
        date_time: { type: String, required: true },
        payment_method: { type: String, required: true }
    },
    { timestamps: true }
);

export default mongoose.models.Transaction || mongoose.model("Transaction", Transaction, "Transaction");
