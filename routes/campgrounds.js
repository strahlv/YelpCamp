const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const catchAsync = require("../utils/catchAsync");
const { validateCampground, isAuthor, isLoggedIn } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");

router.route("/").get(catchAsync(campgrounds.index)).post(
  isLoggedIn,
  upload.array("image"), // TODO: Figure out a way to validate image input BEFORE uploading
  validateCampground, // Has to happen before upload!!!
  catchAsync(campgrounds.create)
);

router.get("/new", isLoggedIn, catchAsync(campgrounds.renderCreate));

router
  .route("/:id")
  .get(catchAsync(campgrounds.show))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.update)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.delete));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderUpdate)
);

module.exports = router;
