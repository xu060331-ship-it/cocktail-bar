const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be set and contain at least 32 characters")
}

const port = Number.parseInt(process.env.PORT || "3000", 10)
const frontendUrl = process.env.FRONTEND_URL

module.exports = {
  jwtSecret,
  port: Number.isInteger(port) && port > 0 ? port : 3000,
  frontendUrl,
}
