const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Users = require('../models/user');

const saltRounds = 10;

router.post('/signup', async (req, res) => {
  const {username, email, password} = req.body;
  const user = new Users(
    {
      username: username,
      email: email,
      password: await bcrypt.hash(password, saltRounds)
    }
  );

  const dbusername = await Users.findOne({username});
  const dbemail = await Users.findOne({email});
  if (dbusername && dbusername.username === username) {
    let message = 'Username is already used, please choose another';
    res.redirect(`/entries/signup?message=${message}`)
  } else if (dbemail && dbemail.email === email) {
    let message = 'Email is already used, please choose another';
    res.redirect(`/entries/signup?message=${message}`)
  } else {
    await user.save();
    req.session.user = user;
    res.redirect('/entries');
  }
});

router.post('/login', async (req, res) => {
  const {username, password} = req.body;
  const user = await Users.findOne({username});

  if (user && (await bcrypt.compare(password, user.password))) {
    req.session.user = user;
    res.redirect('/entries');
  } else {
    let message = 'You are not authorized, please check your username or login!';
    res.redirect(`/entries/login?warningMessage=${message}`);
  }
});

router.get('/logout', async (req, res, next) => {
  if (req.session.user) {
    try {
      await req.session.destroy();
      res.clearCookie("user_sid");
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  } else {
    res.redirect("/entries/login");
  }
});


module.exports = router;