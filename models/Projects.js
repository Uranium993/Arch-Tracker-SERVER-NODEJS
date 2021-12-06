const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },

  creatorName: {
    type: String,
    require: true,
  },
  codename: {
    type: String,
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  clientMail: String,
  clientNumber: String,
  estimatedWorth: Number,
  finalWorth: Number,
  inactive: {
    type: Boolean,
    default: false,
  },

  phases: [
    {
      name: {
        type: String,
        default: "IDR",
      },
      color: {
        type: String,
        default: "gray",
      },
      docs: [
        { docName: { type: String, default: "struja" }, chk: false },
        { docName: { type: String, default: "voda" }, chk: false },
        { docName: { type: String, default: "gas" }, chk: false },
        {
          docName: { type: String, default: "atmosferska kanalizacija" },
          chk: false,
        },
        { docName: { type: String, default: "put" }, chk: false },
        { docName: { type: String, default: "posebni uslovi" }, chk: false },
        { docName: { type: String, default: "urbanizam" }, chk: false },
        { docName: { type: String, default: "lokacijski uslovi" }, chk: false },
      ],
    },
    {
      name: {
        type: String,
        default: "IDP",
      },
      color: {
        type: String,
        default: "gray",
      },
      docs: [
        {
          docName: { type: String, default: "naknada za zemljiste" },
          chk: false,
        },
        {
          docName: { type: String, default: "rjesenje o izgradnji" },
          chk: false,
        },
      ],
    },
    {
      name: {
        type: String,
        default: "PGD",
      },
      color: {
        type: String,
        default: "gray",
      },
      docs: [
        {
          docName: { type: String, default: "naknada za zemljiste" },
          chk: false,
        },
        {
          docName: { type: String, default: "gradjevinska dozvola" },
          chk: false,
        },
      ],
    },
    {
      name: {
        type: String,
        default: "PZI",
      },
      color: {
        type: String,
        default: "gray",
      },
      docs: [
        {
          docName: { type: String, default: "prihvacen projekat" },
          chk: false,
        },
      ],
    },
    {
      name: {
        type: String,
        default: "PIO",
      },
      color: {
        type: String,
        default: "gray",
      },
      docs: [
        { docName: { type: String, default: "upotrebna dozvola" }, chk: false },
      ],
    },
  ],

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Projects = mongoose.model("projects", ProjectSchema);
