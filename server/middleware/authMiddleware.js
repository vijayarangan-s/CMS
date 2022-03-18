const jwt = require("jsonwebtoken");

const isValidUser = (req, res, next) => {
  const token =
    req.header("Authorization").replace("Bearer", "") ||
    req.cookie.token ||
    req.body.token;

  if (!token?.trim()) {
    return res.status(403).send("token is missing");
  }

  try {
    const decode = jwt.verify(token.trim(), "secret");
    req.user = decode
  } catch (e) {
    return res.status(401).send("Invalid Token");
  }

  return next();
};

module.exports = { isValidUser };
