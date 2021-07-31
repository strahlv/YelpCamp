const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mbxToken });

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderCreate = async (req, res) => {
  res.render("campgrounds/new");
};

module.exports.create = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  const geoData = await geocoder
    .forwardGeocode({ query: campground.location, limit: 1 })
    .send();
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user;
  await campground.save();
  req.flash("success", "Sucessfully made a new campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.show = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Campground not found!");
    return res.redirect(`/campgrounds`);
  }
  res.render("campgrounds/show", { campground });
};

module.exports.renderUpdate = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
};

module.exports.update = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(
    id,
    req.body.campground,
    {
      useFindAndModify: false,
      runValidators: true,
      new: true,
    }
  );

  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));

  campground.images.push(...imgs);

  await campground.save();

  const { deleteImages } = req.body;
  if (deleteImages) {
    for (let filename of deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: deleteImages } } },
    });
  }

  if (!campground) {
    req.flash("error", "Campground not found!");
    return res.redirect(`/campgrounds`);
  }
  req.flash("success", "Sucessfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.delete = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id, {
    useFindAndModify: false,
  });
  req.flash("success", "Sucessfully deleted campground!");
  res.redirect(`/campgrounds`);
};
