import { RequestHandler } from "express";
import * as codes from "http-status-codes";

// Middleware import
import errorHandler from "../lib/middlewares/errorHandler";
import Budget from "../models/budget.model";
import budgetValidator from "../lib/middlewares/validators/budget.validators";
import checkAuthority from "../lib/middlewares/check-authority";

// Fetch budget of a specified region, local board or center
export const fetchBudget: RequestHandler = (req, res, next) => {
  const { region, lb, center } = req.query;

  // Set query fillter
  let budgetQuery = {};

  if (region && !lb && !center) {
    budgetQuery = {
      budgetFor: {
        regionalBoard: region,
        localBoard: { $exists: false },
        jklc: { $exists: false },
      },
    };
  } else if (region && lb && !center) {
    budgetQuery = {
      budgetFor: {
        localBoard: lb,
        regionalBoard: region,
        jklc: { $exists: false },
      },
    };
  } else if (region && lb && center) {
    budgetQuery = {
      budgetFor: { jklc: center, localBoard: lb, regionalBoard: region },
    };
  }

  // Find budget basen on budget query
  Budget.findOne(budgetQuery, "budget")
    .lean()
    .then((budget) => {
      // Check if budget was fetched or not
      if (budget == null)
        return errorHandler(
          "Something went wrong. Could not find budget of the specified entity.",
          codes.NOT_FOUND,
          next
        );

      res.status(codes.OK).json({ entityBudget: budget });
    })
    .catch(next);
};

// Fetch budget of the specified id
export const fetchBudgetById: RequestHandler = (req, res, next) => {
  const id = req.params.id;

  // Finf budget based on id
  Budget.findById(id, "budget")
    .lean()
    .then((budget) => {
      if (budget == null)
        return errorHandler(
          "Something went wrong. Could not find the specified budget.",
          codes.NOT_FOUND,
          next
        );

      res.status(codes.OK).json({ entityBudget: budget });
    })
    .catch(next);
};

// Edit budget of the specified id
export const editBudget: RequestHandler = (req, res, next) => {
  const id = req.params.id;
  const type: string = req.userType;

  // Check if budget data is valid
  const { error, value } = budgetValidator.validate(req.body);

  if (error) return errorHandler(error.details[0].message, codes.NOT_ACCEPTABLE, next);

  // Check user's authority based on user type
  const isNational = checkAuthority(type);

  // If user is anybody other than from national throw error
  if (!isNational)
    return errorHandler(
      "You are not authorised to edit a budget. Only National Board can edit a budget.",
      codes.FORBIDDEN,
      next
    );

  Budget.findByIdAndUpdate(id, value, { runValidators: true })
    .then(() => {
      res.status(codes.OK).json({
        message: "Budget updated succesfully!",
      });
    })
    .catch(next);
};
