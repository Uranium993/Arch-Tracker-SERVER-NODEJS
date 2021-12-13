const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const Users = require("../../models/Users");

//@rute    POST api/users
//@desc    Register user
//@access  Public
router.post(
  "/",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Please include valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 3 or more characters"
    ).isLength({ min: 3 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
      //Check if user exists
      let user = await Users.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      //check for admin
      if (req.body.role === "admin") {
        let adminUser = await Users.findOne({ role: "admin" });
        if (adminUser) {
          return res.json({ errors: [{ msg: "Admin already exists" }] });
        }
      }

      user = new Users({
        name,
        email,
        password,
        role,
      });

      //Encrypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();
      // console.log(userSaved);

      const payload = {
        user: {
          name: user.name,
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          const resData = { token, name };
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
