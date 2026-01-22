import { TestResult } from "../models/test-result.model.js";
import { Question } from "../models/questions.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const submitTest = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const userId = req.user._id;

    let score = 0;
    const processedAnswer = [];

    for (const answer of answers) {
      const question = await Question.findById(answer.questionId);
      if (question) {
        if (
          question.correctAnswer &&
          answer.userAnswer === question.correctAnswer
        ) {
          score++;
        }

        processedAnswer.push({
          questionId: question._id,
          userAnswer: answer.userAnswer,
        });
      }
    }

    const testResult = new TestResult({
      user: userId,
      score,
      answers: processedAnswer,
    });

    await testResult.save();
    res
      .status(201)
      .json(new ApiResponse(201, testResult, "Test result processed"));
  } catch (error) {
    next(error);
  }
};

export const getMytests = asyncHandler(async (req, res, next) => {
  const results = await TestResult.find({ user: req.user._id }).populate(
    "answers.questionId",
    "title",
  );
  res.json(new ApiResponse(200, results, "Result fetched successfully"));
});
