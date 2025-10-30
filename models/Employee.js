import mongoose from "mongoose"
import bcrypt from "bcrypt"

SALT_WORK_FACTOR = 10;

const Employee = new mongoose.Schema({
        dept_id: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        role: { type: String, enum: ["Manager", "Associate"], required: true },
        email: { type: String, required: true },
        password_hash: { type: String, required: true }
    },
    { timestamps: true }
);

Employee.pre(save, function(next) {
    var employee = this;

    // only hash the password if it has been modified (or is new)
    if (!employee.isModified('password_hash')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password_hash using our new salt
        bcrypt.hash(employee.password_hash, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password_hash with the hashed one
            employee.password_hash = hash;
            next();
        });
    });


});

Employee.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password_hash, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


export default mongoose.models.Employee || mongoose.model("Employee", Employee, "Employee");