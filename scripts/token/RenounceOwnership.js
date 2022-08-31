const hre = require("hardhat")

async function main() {
  let token = await hre.ethers.getContractAt(
    process.env.TOKEN_CONTRACT_NAME,
    process.env.BCO_TOKEN_ADDRESS
  )
  console.log(`Current token ownership: ${await token.owner()}`)

  const gasPrice = await token.signer.getGasPrice()
  const gasLimit = await token.estimateGas.renounceOwnership()
  console.log(`Renouncing ownership ...`)
  const tx = await token.renounceOwnership({ gasLimit, gasPrice })
  await tx.wait(1)

  token = await hre.ethers.getContractAt(
    process.env.TOKEN_CONTRACT_NAME,
    process.env.BCO_TOKEN_ADDRESS
  )
  console.log(`New token ownership: ${await token.owner()}`)
  console.log(`Token ownership has been renounced.`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
