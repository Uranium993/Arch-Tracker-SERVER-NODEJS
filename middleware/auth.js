const jwt = require("jsonwebtoken");
const config = require("config");

function authUser(req, res, next) {
  //Get token from header
  const token = req.header("x-auth-token");

  //Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  //Verify token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded.user;

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
}

function authRole(req, res, next) {
  if (req.user.role === "admin") {
    res.status(401);
    return res.send("Admin already exists");
  }
  next();
}

module.exports = {
  authUser,
  authRole,
};
