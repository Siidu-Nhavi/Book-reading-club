import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        author: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        rentPrice: {
            type: Number,
            required: true,
            min: 0
        },
        isAvailable: {
            type: Boolean,
            default: true
        },
        description: {
            type: String,
            default: ""
        },
        image: {
            type: String,
            default: ""
        },
    },
    { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
