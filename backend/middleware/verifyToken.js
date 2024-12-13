var jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  var token = req.headers["x-access-token"];
  if (!token)
    return res
      .status(403)
      .send({
        auth: false,
        message: "No token provided.",
        status: 403,
        data: null,
        token: token,
      });
  jwt.verify(token, "AUTH_KEY", function (err, decoded) {
    if (err)
      return res
        .status(401)
        .send({
          auth: false,
          message: "Failed to authenticate token.",
          status: 401,
          data: null,
          token: token,
        });
    req.decodedObj = decoded;
    next();
  });
}

module.exports = {
  verifyToken: verifyToken,
};
