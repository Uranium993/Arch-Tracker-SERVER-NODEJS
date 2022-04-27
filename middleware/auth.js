const jwt = require("jsonwebtoken");
const config = require("config");
const admin = require("../config/firebase-config");

async function authUser(req, res, next) {
  //Get token from header
  const token = req.header("x-auth-token");
  //Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  //Verify token
  try {
    let decoded;
    let decodedUser;

    // if (req.header("user-agent").indexOf("Expo") != -1) {

    // } else {
    //   decoded = jwt.verify(token, config.get("jwtSecret"));
    //   req.user = decoded.user;
    // }

    decoded = await admin.auth().verifyIdToken(token);

    decodedUser = {
      user: decoded.name,
      firebaseUserId: decoded.uid,
    };

    req.user = decodedUser;

    // if (decoded.email_verified === true) {
    // }
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

function authRoleScraper(req, res, next) {
  if (req.user.role !== "admin") {
    res.status(401);
    return res.send("You are not authorized, access denied");
  }
  next();
}

module.exports = {
  authUser,
  authRole,
  authRoleScraper,
};
