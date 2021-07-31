const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const reviews = require("../controllers/reviews");
const { validateReview, isReviewAuthor, isLoggedIn } = require("../middleware");

router.get("/", isLoggedIn, catchAsync(reviews.index));

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.create));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.delete)
);

module.exports = router;
