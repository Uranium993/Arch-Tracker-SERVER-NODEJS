const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { authUser, authRole } = require("../../middleware/auth");
const Users = require("../../models/Users");
const Projects = require("../../models/Projects");
const { check, validationResult } = require("express-validator");
// const scraper = require("../../scraper");

// @route    GET api/projects
// @desc     Get all projects
// @access   Private
router.get("/", async (req, res) => {
  try {
    const projects = await Projects.find({
      inactive: false,
    }).sort({
      date: -1,
    });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/projects
// @desc     Get all archived projects
// @access   Private
router.get("/archived/:menuKey", authUser, async (req, res) => {
  const { menuKey } = req.params;

  try {
    const projects = await Projects.find(
      {
        inactive: true,
        year: menuKey,
      },
      {
        clientName: 1,
        finalWorth: 1,
        creatorName: 1,
        codename: 1,
      }
    ).sort({
      date: -1,
    });

    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/projects
// @desc     Get single project
// @access   Private
router.get("/:id", async (req, res) => {
  try {
    const singleProject = await Projects.find(
      {
        _id: req.params.id,
        inactive: false,
      }
      // "-phases"
    );
    res.json(singleProject);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/projects
// @desc     Get single projectPhase
// @access   Private
router.get("/phase/:id", async (req, res) => {
  try {
    const singleProject = await Projects.find(
      {
        _id: req.params.id,
        inactive: false,
      },
      "phases -_id"
    );

    res.json(singleProject);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route   POST api/projects
//@desc    Create a project tracker
//@access  Private
router.post(
  "/",
  authUser,
  [
    check("codename", "Numerical string codename is required").notEmpty(),
    check("clientName", "Name of a client is required").notEmpty(),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    const {
      codename,
      clientName,
      email,
      clientNumber,
      estimatedWorth,
      finalWorth,
    } = req.body;

    try {
      //Checks if the project exists by codename
      const checkProject = await Projects.findOne({ codename: codename });
      if (checkProject) {
        return res
          .status(400)
          .json({ msg: "Project by that codename already exists" });
      }

      let project = new Projects({
        user: req.user.id ? req.user.id : null,
        firebaseUserId: req.user.firebaseUserId
          ? req.user.firebaseUserId
          : null,
        creatorName: req.user.user,
        codename: codename,
        clientName: clientName,
        clientMail: email,
        clientNumber: clientNumber,
        estimatedWorth: estimatedWorth,
        finalWorth: finalWorth,

        phases: [
          {
            name: "IDR",
            color: "#bfbfbf",
            // docs: [
            //   { docName: "struja", chk: false },
            //   { docName: "voda", chk: false },
            //   { docName: "gas", chk: false },
            //   { docName: "atmosferska kanalizacija", chk: false },
            //   { docName: "put", chk: false },
            //   { docName: "posebni uslovi", chk: false },
            //   { docName: "urbanizam", chk: false },
            //   { docName: "lokacijski uslovi", chk: false },
            // ],
          },
          {
            name: "IDP",
            color: "#bfbfbf",
            // docs: [
            //   { docName: "naknada za zemljiste", chk: false },
            //   { docName: "rjesenje o izgradnji", chk: false },
            // ],
          },
          {
            name: "PGD",
            color: "#bfbfbf",
            // docs: [
            //   { docName: "naknada za zemljiste", chk: false },
            //   { docName: "gradjevinska dozvola", chk: false },
            // ],
          },
          {
            name: "PZI",
            color: "#bfbfbf",
            //docs: [{ docName: "prihvacen projekat", chk: false }],
          },
          {
            name: "PIO",
            color: "#bfbfbf",
            //docs: [{ docName: "upotrebna dozvola", chk: false }],
          },
        ],
      });

      const projectToReturn = await project.save();

      res.json(projectToReturn);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route   PATCH api/projects
//@desc    Update project phases
//@access  Private
router.patch(
  "/update/:id",
  authUser,

  async (req, res) => {
    try {
      const updateData = {
        ...req.body,
      };

      const updatePhase = await Projects.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            "phases.$[eX]": updateData,
            // "phases.$[eX].dates.$[i].date": req.body.date,
          },
        },
        {
          arrayFilters: [
            { "eX.name": updateData.name },
            // { i: req.body.index }
          ],
          new: true,
        }
      );

      const response = await updatePhase.phases;

      res.json(response);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route   PATCH api/projects
//@desc    Update project info
//@access  Private
router.patch("/:id", authUser, async (req, res) => {
  try {
    const { clientMail, clientNumber, estimatedWorth, finalWorth, inactive } =
      req.body;
    console.log(req.body);
    const updateData = {};

    if (clientMail) updateData.clientMail = clientMail;
    if (clientNumber) updateData.clientNumber = clientNumber;
    if (estimatedWorth) updateData.estimatedWorth = Number(estimatedWorth);
    if (finalWorth) updateData.finalWorth = Number(finalWorth);
    if (inactive) updateData.inactive = Boolean(inactive);

    const response = await Projects.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: updateData,
      },
      {
        new: true,
      }
    );

    console.log(response);
    res.json(response);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//@route   DELETE api/projects
//@desc    Delete project
//@access  Private
router.delete("/:id", authUser, async (req, res) => {
  try {
    console.log(req.params);
    await Projects.findByIdAndDelete(req.params.id, (err, deleted) => {
      if (err) throw err;
      res.json(deleted);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
