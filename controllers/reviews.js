const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.index = async (req, res) => {
  const { id } = req.params;
  res.redirect(`/campgrounds/${id}`);
};

module.exports.create = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const review = new Review(req.body.review);
  review.author = req.user;
  await review.save();
  campground.reviews.push(review);
  await campground.save();
  req.flash("success", "Sucessfully created a new review!");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.delete = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(
    id,
    { $pull: { reviews: reviewId } },
    { useFindAndModify: false }
  );

  await Review.findByIdAndDelete(reviewId, {
    useFindAndModify: false,
  });

  req.flash("success", "Sucessfully deleted review!");
  res.redirect(`/campgrounds/${id}`);
};
