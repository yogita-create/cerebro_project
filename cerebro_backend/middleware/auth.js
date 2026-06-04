const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    console.log("AUTH HEADER:", auth);

    if (!auth?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = auth.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.id;

    next();

  } catch (err) {

    console.error("AUTH ERROR:", err);

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = protect;