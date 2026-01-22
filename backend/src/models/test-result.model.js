import mongoose from "mongoose";

const testResultSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
      userAnswer: {
        type: String,
      },
    },
  ],
},{timestamps: true});

export const TestResult = mongoose.model("TestResult",testResultSchema)
