import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, required: true, unique: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    customer: { type: String, trim: true, default: "Walk-in" },
    product: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ["Cash", "Card", "bKash", "Nagad"], default: "Cash" },
    status: { type: String, enum: ["Completed", "Pending", "Refunded"], default: "Completed" },
    date: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

saleSchema.index({ branch: 1, date: -1 });
saleSchema.index({ invoiceNo: "text", customer: "text", product: "text" });

saleSchema.pre("validate", function () {
  if (this.quantity != null && this.unitPrice != null) {
    this.total = this.quantity * this.unitPrice;
  }
});

export default mongoose.model("Sale", saleSchema);
