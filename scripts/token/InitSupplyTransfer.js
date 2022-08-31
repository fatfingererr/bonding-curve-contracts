const hre = require("hardhat")

async function main() {
  let token = await hre.ethers.getContractAt(
    process.env.TOKEN_CONTRACT_NAME,
    process.env.BCO_TOKEN_ADDRESS
  )

  const unit = hre.ethers.BigNumber.from("1000000000000000000") // 1 TOKEN = 1000000000000000000 (18 digits)
  const initSupply = await token.balanceOf(process.env.ACCOUNT)
  console.log(`You have ${hre.ethers.BigNumber.from(initSupply).div(unit)} $${process.env.BCO_TOKEN_SYMBOL}`)
  const amount = hre.ethers.BigNumber.from(initSupply)

  const gasPrice = await token.signer.getGasPrice()
  const gasLimit = await token.estimateGas.transfer(process.env.BCO_CONTRACT_ADDRESS, amount)
  console.log(`Init supply transferring ...`)
  const tx = await token.transfer(process.env.BCO_CONTRACT_ADDRESS, amount, { gasLimit, gasPrice })
  await tx.wait(1)
  console.log(`Init supply is transferred.`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
