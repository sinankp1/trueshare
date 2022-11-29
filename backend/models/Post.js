const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["profilePicture", "cover", null],
      default: null,
    },
    text: {
      type: String,
    },
    images: {
      type: Array,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    background: {
      type: String,
    },
    comments: [
      {
        comment: {
          type: String,
        },
        image: {
          type: String,
        },
        commentBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        commentAt: {
          type: Date,
          default: new Date(),
        },
      },
    ],
    reports: [
      {
        report: {
          type: String,
          enum: ["Act of violence", "Nudity","Harrassment","Impersonation"],
        },
        reportBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        reportedAt: {
          type: Date,
          default: new Date(),
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
