const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define Payroll schema
const PayrollSchema = new Schema(
    {
        seller: { type: Schema.Types.ObjectId, ref: "Seller", required: true }, // Reference to User schema
        role: {
            type: String,
            enum: ["seller"],
        },
        salary: {
            type: Number,
            default: 0,
            validate: {
                validator: function (v) {
                    if (this.role === "seller") {
                        return v === 0;
                    }
                    return true;
                },
                message: (props) => `Salary should be 0 for sellers`,
            },
        },
        amount: {
            type: Number,
            default: 0,
            validate: {
                validator: function (v) {
                    if (this.role !== "seller") {
                        return v === 0;
                    }
                    return true;
                },
                message: (props) => `Amount should be 0 for non-sellers`,
            },
        },
        paidAmount: {
            type: Number,
            default: 0,
            validate: {
                validator: function (v) {
                    if (this.role !== "seller") {
                        return v === 0;
                    }
                    return true;
                }
            }
        },
        transactions: [{
            transaction: {
                type: Schema.Types.ObjectId, ref: "Transaction"
            },
            date: {
                type: Date,
                default: Date.now,
            }
        }],
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: true },
    }
);

const Payroll = mongoose.model("Payroll", PayrollSchema);

module.exports = Payroll;
