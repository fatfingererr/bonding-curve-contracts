const hre = require("hardhat")

async function main() {
  let gasPrice
  let gasLimit

  const BCO = await hre.ethers.getContractAt(
    process.env.BCO_CONTRACT_NAME,
    process.env.BCO_CONTRACT_ADDRESS
  )

  const Token = await hre.ethers.getContractAt(
    process.env.TOKEN_CONTRACT_NAME,
    process.env.BCO_TOKEN_ADDRESS
  )

  const unit = hre.ethers.BigNumber.from("1000000000000000000") // 1 TOKEN = 1000000000000000000 (18 digits)
  // const amount = hre.ethers.BigNumber.from("9043630702362030348576")
  const amount = hre.ethers.BigNumber.from("1").mul(unit)
  console.log(
    `Approving ${amount.div(unit.div(1000000000)).toNumber()/1000000000.0} $${
      process.env.BCO_TOKEN_SYMBOL
    } for the reimbursement ... \n`
  )
  gasLimit = await Token.estimateGas.approve(
    process.env.BCO_CONTRACT_ADDRESS,
    amount
  )
  gasPrice = await Token.signer.getGasPrice()
  const atx = await Token.approve(process.env.BCO_CONTRACT_ADDRESS, amount, {
    gasLimit,
    gasPrice
  })
  console.log(
    `You will need to wait for the block to be mined... This may take some time\n`
  )
  await atx.wait(1)
  console.log(`Reimbursing ...\n`)
  gasLimit = await BCO.estimateGas.Reimbursement(amount)
  const tx = await BCO.Reimbursement(amount, { gasLimit, gasPrice })
  await tx.wait(1)
  console.log(
    `Reimburse USDT for ${amount.div(unit.div(1000000000)).toNumber()/1000000000.0} $${
      process.env.BCO_TOKEN_SYMBOL
    } is successful.\n`
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
