import mongoose from "mongoose";
import { PaymentEnum } from "./Enum.js";

const Transaction = new mongoose.Schema({
        returned_id: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
        payment_method: { type: String, enum: PaymentEnum,  required: true }
    },
    { timestamps: true }
);

export default mongoose.models.Transaction || mongoose.model("Transaction", Transaction, "Transaction");
