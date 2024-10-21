const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    sku: { type: String, required: true },
    selling_price: { type: Number, required: true },
    currency: { type: String, required: true },
    availability: { type: String, required: true },
    color: { type: String, required: true },
    category: { type: String, required: true },
    source: { type: String, required: true },
    source_website: { type: String, required: true },
    breadcrumbs: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    images: { type: String, required: true },
    country: { type: String, required: true },
    language: { type: String, required: true },
    average_rating: { type: Number, required: true },
    reviews_count: { type: Number, required: true },
    crawled_at: { type: Date, required: true }
});

const myDB = mongoose.connection.useDb('ProductData');

const Products = myDB.model('Product', productSchema);

module.exports = Products;
