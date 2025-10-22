import mongoose from "mongoose";

const Department = new mongoose.Schema({
        dept_id: { type: int, required: true, unique: true, index: true },
        dept_name: { type: Number, required: true },
    },
    { timestamps: true }
);

export default mongoose.models.Department || mongoose.model("Department", Department);
