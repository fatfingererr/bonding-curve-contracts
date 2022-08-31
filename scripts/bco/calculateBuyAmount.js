const hre = require("hardhat")

async function main() {
  const args = process.argv.slice(2)
  const BCO = await hre.ethers.getContractAt(
    process.env.BCO_CONTRACT_NAME,
    process.env.BCO_CONTRACT_ADDRESS
  )
  const amount = Number(args[0])
  const usdtUnit = 1000000 // 1 USDT = 1000000 (6 digits)
  const tokenHalfUnit = 1000000000 // 9 digits
  const tokens = await BCO.calculateBuyAmount(amount * usdtUnit)

  // use 1 USDT = 1000000 (6 digits)
  // get 483970871625882028950
  // neeed to div "1000000000000000000" (18 digits)
  // Get 483.97087162588202895

  const tokenInUnit =
    hre.ethers.BigNumber.from(tokens).div(tokenHalfUnit).toNumber() /
    tokenHalfUnit
  const PriceInUnit = (tokenHalfUnit * amount) / (tokens / tokenHalfUnit)
  console.log("USDT Amount: ", amount)
  console.log("Tokens: ", tokenInUnit)
  console.log("Price: ", PriceInUnit)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
