const checkAuthority = (userType: string, status?: string) => {
  let isAuthorised = false;

  // Check if user is of National level
  if (userType === "nt") {
    isAuthorised = true;
    return isAuthorised;
  }

  // If status of a program is provided
  // Check if user is authorised based on status
  if (status) {
    switch (status) {
      case "Pending":
        isAuthorised = true;
        break;
      case "Approved By Local":
        if (userType === "nt" || "rg" || "lc") {
          isAuthorised = true;
        }
        break;
      case "Approved By Regional":
        if (userType === "nt" || "rg") {
          isAuthorised = true;
        }
        break;
      case "Approved By National":
        if (userType === "nt") {
          isAuthorised = true;
        }
        break;
      default:
        isAuthorised = true;
    }
  }

  return isAuthorised;
};

export default checkAuthority;
