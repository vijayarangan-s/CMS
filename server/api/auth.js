const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const route = express.Router();
const User = require("../schema/userSchema");
const { isValidUser } = require("../middleware/authMiddleware");

route.post("/login", async (req, res) => {
  const { email, password } = req?.body || {};

  try {
    const user = await User.findOne({ email });
    const { password: userPass } = user || {};

    const checkValidUser = await bcrypt.compare(password, userPass);

    if (!checkValidUser) {
      return res.status(400).send({
        success: false,
        data: "Please check your username and password..1",
      });
    }
    const token = jwt.sign({ email }, "secret", { expiresIn: "2000m" });
    console.log({ token });

    await User.findOneAndUpdate({ email }, { $set: { token } });

    return res
      .status(200)
      .send({ success: true, data: "Login Successfull....", token });
  } catch (e) {
    return res.status(500).send({ success: false, err: e?.message });
  }
});

route.post("/signup", async (req, res) => {
  let hashPassword = "";
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPwd,
    phone = "",
  } = req?.body || {};

  if (password !== confirmPwd) {
    return res
      .status(400)
      .send({ success: false, err: "Please reset your password" });
  }

  if (password === confirmPwd) {
    hashPassword = await bcrypt.hash(password, 10);
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .send({ success: false, err: "Email Already exists...!" });
    }

    const newUser = {
      firstName,
      lastName,
      email,
      password: hashPassword || "",
      phone,
    };

    const user = await User.create(newUser);

    return res.status(200).send({ success: true, data: user });
  } catch (e) {
    return res.status(500).send({ success: false, err: e?.message });
  }
});

route.get("/dashboard", isValidUser, (req, res) => {
  try {
    res.status(200).send({ success: true, data: "Dashboard loaded" });
  } catch (e) {
    res.status(500).send({ success: false, err: e?.message });
  }
});

route.get("/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

route.get('/google/callback', 
passport.authenticate('google'), 
  (req, res) => {
    res.setHeader('Content-Type', 'application/json');  
  res.redirect('/')
})

route.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = route;
