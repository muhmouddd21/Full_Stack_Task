const jwt = require('jsonwebtoken');


function generateAccessToken(user) {
  const payload = {
    id: user.id,
    username: user.username
  };

  return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m' // Default to 15 minutes if not set
  });
}


function generateRefreshToken(user) {
  const payload = {
    id: user.id
  };

  return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '14d' 
  });
}
 //  Functions to verify tokens 
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null; // Token is invalid or expired
  }
}

function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken    
};