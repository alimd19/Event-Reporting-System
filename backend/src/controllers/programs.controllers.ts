import { RequestHandler } from "express";
import * as codes from "http-status-codes";
import Program from "../models/program.model";

// Type import
import { IProgram } from "../lib/types/program.types";

// Middleware imports
import programValidator, {
  isTotalEqual,
} from "../lib/middlewares/validators/program.validator";
import errorHandler from "../lib/middlewares/errorHandler";
import checkAuthority from "../lib/middlewares/check-authority";

// Fetch all programs or all programs of a particular region, local-board or center
export const fetchAllPrograms: RequestHandler = (req, res, next) => {
  const { region, lb, center } = req.query;

  // Set query fillter
  let programQuery = {};

  if (region && !lb && !center) {
    programQuery = { "basic.center.regionalBoard": region };
  } else if (region && lb && !center) {
    programQuery = { "basic.center.localBoards": lb };
  } else if (region && lb && center) {
    programQuery = { "basic.center.jklcs": center };
  }

  // Fetch all programs based on query
  Program.find(programQuery, "participants basic programState")
    .lean()
    .then((programs) => {
      // Check if programs were fetched or not
      if (programs.length === 0) {
        return errorHandler("Could not find any programs.", codes.NOT_FOUND, next);
      }

      res.status(codes.OK).json({
        programs: programs,
      });
    })
    .catch(next);
};

// Fetch program of the specified id
export const fetchProgramById: RequestHandler = (req, res, next) => {
  const id = req.params.id;

  // Fetch program based on id
  Program.findById(id)
    .lean()
    .then((program) => {
      // Check if program was fetched or not
      if (program == null) {
        return errorHandler(
          "Something went wrong, couldn't find the specified program.",
          codes.NOT_FOUND,
          next
        );
      }

      res.status(codes.OK).json({ program });
    })
    .catch(next);
};

// Add a new program
export const addProgram: RequestHandler = (req, res, next) => {
  const { finances, participants } = req.body;

  // Check if program data is valid
  const checkTotal = isTotalEqual(finances, participants);

  if (checkTotal.isEqual) {
    const { error, value } = programValidator.validate(req.body);

    if (error) {
      return errorHandler(
        error.details[0].message + ". Coming from validator.",
        codes.NOT_ACCEPTABLE,
        next
      );
    } else {
      // Create and save new program
      let newProgram: IProgram = new Program(value);

      newProgram
        .save()
        .then(() => {
          res.status(codes.OK).json({ message: "Program added successfully!" });
        })
        .catch(next);
    }
  } else {
    return errorHandler(checkTotal.message, codes.NOT_ACCEPTABLE, next);
  }
};

// Edit program of the specified id
export const editProgramById: RequestHandler = (req, res, next) => {
  const id = req.params.id;
  const type: string = req.userType;
  const { finances, participants } = req.body;

  // Check if program data is valid
  const checkTotal = isTotalEqual(finances, participants);

  if (checkTotal.isEqual) {
    const { error, value } = programValidator.validate(req.body);

    if (error) {
      return errorHandler(error.details[0].message, codes.NOT_ACCEPTABLE, next);
    } else {
      // Find program based on id
      Program.findById(id, "programState")
        .lean()
        .then((program) => {
          const status = program?.programState.status;
          const isAuthorised = checkAuthority(type, status);

          // Check if program was fetched or not
          if (program == null)
            return errorHandler(
              "Something went wrong, could not find the specified program",
              codes.NOT_FOUND,
              next
            );

          // Check user's authority based on user type and program status
          if (isAuthorised) {
            // Upadte program based on id
            Program.findByIdAndUpdate(id, value, { runValidators: true })
              .then(() => {
                res
                  .status(codes.OK)
                  .json({ message: "Program updated successfully!" });
              })
              .catch(next);
          } else {
            return errorHandler(
              "You are not authorised to update this program",
              codes.FORBIDDEN,
              next
            );
          }
        })
        .catch(next);
    }
  } else {
    return errorHandler(checkTotal.message, codes.NOT_ACCEPTABLE, next);
  }
};

export const deleteProgramById: RequestHandler = (req, res, next) => {
  const id = req.params.id;
  const type: string = req.userType;

  Program.findById(id, "programState")
    .lean()
    .then((program) => {
      const status = program?.programState.status;
      const isAuthorised = checkAuthority(type, status);

      // Check if program was fetched or not
      if (program == null)
        return errorHandler(
          "Something went wrong, could not find the specified program",
          codes.NOT_FOUND,
          next
        );

      // Check user's authority based on user type and program status
      if (isAuthorised) {
        Program.findByIdAndDelete(id)
          .then(() => {
            res
              .status(codes.OK)
              .json({ message: "Program deleted successfully!" });
          })
          .catch(next);
      } else {
        return errorHandler(
          "You are not authorised to delete this program",
          codes.FORBIDDEN,
          next
        );
      }
    })
    .catch(next);
};
