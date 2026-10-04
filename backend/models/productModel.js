import mongoose from "mongoose";

// Stock is held per size, because a poster can run out in A3 while A4 is fine.
const stockSchema = new mongoose.Schema({
    size: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    // A size can be taken off sale without touching its count.
    available: { type: Boolean, default: true },
}, { _id: false })

const productSchema = new mongoose.Schema({
    // Human-readable id ("sk001"), kept so the storefront's links survive the
    // move to the database.
    sku: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, required: true, default: '' },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    image: { type: [String], required: true, default: [] },
    category: { type: String, required: true, index: true },
    subCategory: { type: String, required: true, default: 'Single' },
    sizes: { type: [String], required: true, default: [] },
    // Split sets only.
    panels: { type: Number, default: null },
    orientation: { type: String, default: null },
    bestseller: { type: Boolean, default: false },
    isCustom: { type: Boolean, default: false },
    tags: { type: [String], default: [] },

    stock: { type: [stockSchema], default: [] },
    // The switch the admin flips to pull a poster off the shop floor.
    outOfStock: { type: Boolean, default: false },
    active: { type: Boolean, default: true },

    sold: { type: Number, default: 0 },
    date: { type: Number, required: true, default: () => Date.now() },
}, { timestamps: true })

// What the storefront needs, in the shape it already expects.
productSchema.methods.toStorefront = function toStorefront() {
    return {
        _id: this.sku,
        id: this._id.toString(),
        name: this.name,
        description: this.description,
        price: this.price,
        originalPrice: this.originalPrice,
        image: this.image,
        category: this.category,
        subCategory: this.subCategory,
        panels: this.panels,
        orientation: this.orientation,
        sizes: this.sizes,
        bestseller: this.bestseller,
        isCustom: this.isCustom,
        tags: this.tags,
        outOfStock: this.outOfStock,
        // Sizes with nothing left are hidden from the picker.
        soldOutSizes: this.stock.filter(s => !s.available || s.quantity <= 0).map(s => s.size),
        date: this.date,
    }
}

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel
