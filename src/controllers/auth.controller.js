const userModel = require("../models/user.model");

const emailService = require("../services/email.service");

/**
 * - user register controller
 * - POST /api/auth/register
 */
async function userRegisterController(req, res) {
  const { email, password, name } = req.body;

  const isExists = await userModel.findOne({
    email: email,
  });

  if (isExists) {
    return res.status(422).json({
      message: "User Already exists with email",
      status: "failed",
    });
  }

  const user = await userModel.create({
    email,
    password,
    name,
  });

  const token = user.generateAuthToken();
  res.cookie("token", token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
  res.status(201).json({ token, user });

  await emailService.sendRegistrationEmail(user.email, user.name);
}

/**
 * - user login controller
 * - POST /api/auth/login
 */

async function userLoginController(req, res) {
  const { email, password } = req.body;

  const user = await userModel
    .findOne({
      email,
    })
    .select("+password");

  if (!user) {
    return res.status(401).json({
      message: "Email or Password is INVALID",
    });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    emailService.sendSecurityAlertEmail(user.email, user.name);
    return res.status(401).json({
      message: "Password is INVALID",
    });
  }

  const token = user.generateAuthToken();

  res.cookie("token", token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  res.status(201).json({
    token,
    user,
  });
}

module.exports = {
  userRegisterController,
  userLoginController,
};
