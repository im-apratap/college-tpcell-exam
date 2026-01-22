import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String
    },  
    type: {
        type: String,
        enum: ["single","multi","descriptive"],
        required: true
    },
    options: [
        {type: String}
    ],
    correctAnswer: {
        type: String,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{timestamps: true})

export const Question = mongoose.model("Question",questionSchema)