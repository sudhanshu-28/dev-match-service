const adminAuth = (req, res, next) => {
  console.log("Admin Auth is called");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";

  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized User");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("User Auth is called");
  const token = "abc";
  const isUserAuthorized = token === "abc";

  if (!isUserAuthorized) {
    res.status(401).send("Unauthorized User");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
