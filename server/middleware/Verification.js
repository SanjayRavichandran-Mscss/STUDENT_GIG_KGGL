// import jwt from "jsonwebtoken";

// const Verification = async (req, res, next) => {
//   const { accessToken } = req.cookies;

//   try {
//     if (!accessToken) {
//       res.json({ status: false, msg: "token_expired" });
//     } else {
//       const token = jwt.verify(accessToken, "your_secret_key_here");
//       next();
//     }
//   } catch (err) {
//     res.json({ msg: "catch_error" });
//   }
// }

// export default Verification;
















import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const Verification = async (req, res, next) => {
  const { accessToken } = req.cookies;

  try {
    if (!accessToken) {
      return res.status(401).json({ status: false, msg: "token_expired" });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded; // Store decoded token data (contains user.student_id)
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ status: false, msg: "token_expired" });
    }
    return res.status(403).json({ status: false, msg: "invalid_token" });
  }
};

export default Verification;