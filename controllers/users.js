const User = require("../models/user");

module.exports.renderRegister = async (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  try {
    console.log("Try create user");
    const { username, email, password } = req.body;
    const user = new User({ username: username, email: email });
    const newUser = await User.register(user, password);
    console.log(newUser);
    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Successfully registered a new account!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLogin = async (req, res) => {
  res.render("users/login");
};

module.exports.login = async (req, res) => {
  req.flash("success", `Welcome back, ${req.user.username}!`);
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = async (req, res) => {
  req.logout();
  req.flash("success", "See you later!");
  res.redirect("/campgrounds");
};
