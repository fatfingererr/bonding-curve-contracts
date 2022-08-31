require('dotenv').config();

module.exports = [
  process.env.BCO_TOKEN_ADDRESS,
  process.env.BCO_TOKEN_DIGITS, // token decimals, must >= 6
  process.env.BCO_TOKEN_RATE, // the recommended rate
  process.env.BCO_TOKEN_RATE * 1000000, // the recommended number for BCO calculation, not the token supply, represented in ppm
  process.env.ACCOUNT,
  process.env.BCO_TAX_RATE, // taxRate, represented in ppm, 1-1000000
  process.env.BCO_CONNECTOR_WEIGHT // connectorWeight, represented in ppm, 1-1000000
]

