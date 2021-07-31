const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", () => console.error("Connection error!"));
db.once("open", () => console.log("Database connected!"));

const randomItem = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const r = Math.floor(Math.random() * 1000);
    const city = cities[r];
    await Campground.create({
      author: "60fb1b8f3a070c1c7cea1b27",
      title: `${randomItem(descriptors)} ${randomItem(places)}`,
      price: (10 + Math.random() * 100).toFixed(2),
      location: `${city.city} - ${city.state}`,
      geometry: {
        type: "Point",
        coordinates: [city.longitude, city.latitude],
      },
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam mollitia rem sequi cupiditate odit fugiat cum itaque ratione quam tenetur.",
      images: [
        {
          url: "https://res.cloudinary.com/dlmgxenjc/image/upload/v1627587188/yelp-camp/rhxpg8nam1mho0o7gtyf.jpg",
          filename: "yelp-camp/rhxpg8nam1mho0o7gtyf",
        },
        {
          url: "https://res.cloudinary.com/dlmgxenjc/image/upload/v1627587188/yelp-camp/sptvueised5uystxmggd.jpg",
          filename: "yelp-camp/sptvueised5uystxmggd",
        },
        {
          url: "https://res.cloudinary.com/dlmgxenjc/image/upload/v1627587189/yelp-camp/tauuixm9dw0tjw87vrzr.jpg",
          filename: "yelp-camp/tauuixm9dw0tjw87vrzr",
        },
        {
          url: "https://res.cloudinary.com/dlmgxenjc/image/upload/v1627587188/yelp-camp/qaxkvbstqqez4inpp54k.jpg",
          filename: "yelp-camp/qaxkvbstqqez4inpp54k",
        },
        {
          url: "https://res.cloudinary.com/dlmgxenjc/image/upload/v1627587188/yelp-camp/bio1bzsbgjskmtlvbvdi.jpg",
          filename: "yelp-camp/bio1bzsbgjskmtlvbvdi",
        },
      ],
    });
  }
  console.log("DB successfully seeded!");
};

seedDB().then(() => mongoose.connection.close());
