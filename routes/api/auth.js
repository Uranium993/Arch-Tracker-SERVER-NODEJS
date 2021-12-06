const express = require("express");
const router = express.Router();
const { authUser, authRole } = require("../../middleware/auth");
const Users = require("../../models/Users");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");

//@rute   GET api/auth
//@desc   get user data
//@access Private
router.get("/", async (req, res) => {
  try {
    // const user = await Users.findById(req.user.id).select("-password");

    let adminUser = await Users.findOne({ role: "admin" }).exec();

    if (adminUser === "admin") {
      return res.json({ errors: [{ msg: "Admin already exists" }] });
    }

    res.json(adminUser);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//@rute   POST api/auth
//@desc   login user
//@access Private
router.post(
  "/",
  [
    check("email", "Please include valid email").isEmail(),
    check("password", "Please include valid password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      //Check if user exists

      const user = await Users.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          user: user.name,
          id: user.id,
          role: user.role,
        },
      };

      const userName = user.name;

      jwt.sign(
        payload,
        config.get("jwtSecret"),

        (err, token) => {
          if (err) throw err;
          const resData = { token, userName };
          res.json({ resData });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
