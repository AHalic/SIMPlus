import mongoose from "mongoose";

const Department = new mongoose.Schema({
        dept_name: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.models.Department || mongoose.model("Department", Department, "Department");
