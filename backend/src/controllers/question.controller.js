import { Question } from "../models/questions.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createQuestion = async (req, res, next) => {
  try {
    const { title, description, type, options, correctAnswer, imageUrl } =
      req.body;

    const createdBy = req.user._id;

    if (
      (type === "single" || type === "multi") &&
      (!options || options.length === 0)
    ) {
      throw new ApiError(400, "MCQ must have options");
    }

    const question = new Question({
      title,
      description,
      type,
      options,
      correctAnswer,
      creator: createdBy,
      imageUrl,
    });

    await question.save();

    return res
      .status(201)
      .json(new ApiResponse(201, question, "Question created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getQuestion = async (req, res, next) => {
  try {
    const questions = await Question.find();
    res.json(new ApiResponse(200, questions, "Question fetched successfully"));
  } catch (error) {
    next(error);
  }
};
