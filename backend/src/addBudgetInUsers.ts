import User from "./models/user.model";
import Budget from "./models/budget.model";

const addBudget = () => {
  Budget.find()
    .lean()
    .then((budgets) => {
      budgets.forEach((budget) => {
        const { budgetFor } = budget;

        let query;
        if (!budgetFor) {
          query = { location: { $exists: false } };
        } else {
          query = { location: budget.budgetFor };
        }
        console.log(query);

        User.findOneAndUpdate(query, { $set: { budget: budget._id } })
          .then((user) => console.log("Success", user?._id))
          .catch((error) => console.log(error));
      });
    });
};

export default addBudget;
