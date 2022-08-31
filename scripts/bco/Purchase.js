const hre = require("hardhat")
const USDTAbi = require("../../abi/USDT.json")

async function main() {
  let gasPrice
  let gasLimit

  const BCO = await hre.ethers.getContractAt(
    process.env.BCO_CONTRACT_NAME,
    process.env.BCO_CONTRACT_ADDRESS
  )

  const USDT = await hre.ethers.getContractAt(
    USDTAbi,
    process.env.BCO_USDT_ADDRESS
  )

  const unit = 1000000 // 1 USDT = 1000000 (6 digits)
  const amount = 10 * unit
  console.log(`Approving ${amount / unit} USDT for the purchase ... \n`)
  gasLimit = await USDT.estimateGas.approve(
    process.env.BCO_CONTRACT_ADDRESS,
    amount
  )
  gasPrice = await USDT.signer.getGasPrice()
  const atx = await USDT.approve(process.env.BCO_CONTRACT_ADDRESS, amount, {
    gasLimit,
    gasPrice
  })
  console.log(
    `You will need to wait for the block to be mined... This may take some time\n`
  )
  await atx.wait(1)
  console.log(`Purchasing ...\n`)
  gasLimit = await BCO.estimateGas.Purchase(amount)
  const tx = await BCO.Purchase(amount, { gasLimit, gasPrice })
  await tx.wait(1)
  console.log(
    `Purchase $${process.env.BCO_TOKEN_SYMBOL} for ${
      amount / unit
    } USDT is successful.\n`
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
