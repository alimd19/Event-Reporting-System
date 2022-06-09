import { RequestHandler } from "express";
import * as codes from "http-status-codes";

// Model import
import Youth_Member from "../models/youth-member.model";

// Middleware imports
import youthMemberValidator from "../lib/middlewares/validators/youth-member.validator";
import errorHandler from "../lib/middlewares/errorHandler";
import checkAuthority from "../lib/middlewares/check-authority";

// Fetch all youth-members or all youth-members of a particular region, local-board or center
export const fetchAllYouthMembers: RequestHandler = (req, res, next) => {
  const { region, lb, center } = req.query;

  // Set query fillter
  let youthMemberQuery = {};

  if (region && !lb && !center) {
    youthMemberQuery = { "center.regionalBoard": region };
  } else if (region && lb && !center) {
    youthMemberQuery = { "center.localBoard": lb };
  } else if (region && lb && center) {
    youthMemberQuery = { "center.center": center };
  }

  // Fetch all youth-members based on query
  Youth_Member.find(youthMemberQuery, "basic")
    .then((youthMembers) => {
      // Check if youth-members were fetched or not
      if (youthMembers.length === 0) {
        return errorHandler(
          "Could not find any youth members.",
          codes.NOT_FOUND,
          next
        );
      }

      res.status(codes.OK).json({ youthMembers }).writeHead(codes.OK);
    })
    .catch(next);
};

// Fetch youth-member of the specified id
export const fetchYouthMemberById: RequestHandler = (req, res, next) => {
  const id = req.params.id;

  // Fetch youth-member based on id
  Youth_Member.findById(id)
    .then((youthMember) => {
      // Check if youth-member was fetched or not
      if (youthMember == null) {
        return errorHandler(
          "Something went wrong, couldn't find the specified youth member.",
          codes.NOT_FOUND,
          next
        );
      }

      res.status(codes.OK).json({ youthMember });
    })
    .catch(next);
};

// Edit youth-member of the specified id
export const editYouthMember: RequestHandler = (req, res, next) => {
  const id = req.params.id;
  const type: string = req.userType;

  // Check if youth-member data is valid
  const { error, value } = youthMemberValidator.validate(req.body);

  if (error) return errorHandler(error.details[0].message, codes.NOT_ACCEPTABLE, next);

  // Check user's authority based on user type
  const isNational = checkAuthority(type);

  if (isNational) {
    // If user is from National board update everything
    Youth_Member.findByIdAndUpdate(id, value, {
      runValidators: true,
    })
      .then(() => {
        res.status(codes.OK).json({
          message: "Youth member updated succesfully!",
        });
      })
      .catch(next);
  } else {
    // If user is not from National board update everything except youth-member's center
    Youth_Member.findByIdAndUpdate(
      id,
      {
        $set: {
          basic: value.basic,
          contact: value.contact,
          editStatus: value.editStatus,
        },
      },
      { runValidators: true }
    )
      .then(() => {
        res.status(codes.OK).json({
          message: "Youth member updated succesfully!",
        });
      })
      .catch(next);
  }
};

// Delete youth-member of the specified id
export const deleteYouthMember: RequestHandler = (req, res, next) => {
  const id = req.params.id;
  const type: string = req.userType;

  // Check user's authority based on user type
  const isNational = checkAuthority(type);

  if (!isNational)
    return errorHandler(
      "You are not authorised to delete a youth member.",
      codes.FORBIDDEN,
      next
    );

  // Find and delete youth-member based on id
  Youth_Member.findByIdAndDelete(id)
    .then(() => {
      res
        .status(codes.OK)
        .json({ message: "Youth member deleted successfully!" });
    })
    .catch(next);
};
