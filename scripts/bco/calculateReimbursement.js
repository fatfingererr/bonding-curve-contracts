const hre = require("hardhat")

async function main() {
  const args = process.argv.slice(2)
  const BCO = await hre.ethers.getContractAt(
    process.env.BCO_CONTRACT_NAME,
    process.env.BCO_CONTRACT_ADDRESS
  )
  const tokenInUnit = 1
  const tokenUnit = hre.ethers.BigNumber.from("1000000000000000000") //  1TOKEN =  1000000000000000000 (18 digits)
  const tokenHalfUnit = 1000000000 // 9 digits
  const rate = 10000;
  const amount = await BCO.calculateReimbursement(tokenUnit.mul(tokenInUnit))
  const amountInUnit = hre.ethers.BigNumber.from(amount).div(tokenHalfUnit).toNumber() / (tokenHalfUnit * rate)

  // Sell
  // use 1TOKEN =  1000000000000000000 (18 digits)
  // get 14035761109883767766
  // need to div "10000000000000000000000" (22 digits = 18 token digits + 4 rate digits)
  // Get $0.001403

  const PriceInUnit = amountInUnit / tokenInUnit;
  console.log("Token: ", tokenInUnit)
  console.log("Reimbursement: ", amountInUnit)
  console.log("Price: ", PriceInUnit)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
