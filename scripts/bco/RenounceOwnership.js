const hre = require("hardhat")

async function main() {
  let bco = await hre.ethers.getContractAt(
    process.env.BCO_CONTRACT_NAME,
    process.env.BCO_CONTRACT_ADDRESS
  )
  console.log(`Current BCO ownership: ${await bco.owner()}`)

  const gasPrice = await bco.signer.getGasPrice()
  const gasLimit = await bco.estimateGas.renounceOwnership()
  console.log(`Renouncing ownership ...`)
  const tx = await bco.renounceOwnership({ gasLimit, gasPrice })
  await tx.wait(1)

  bco = await hre.ethers.getContractAt(
    process.env.BCO_CONTRACT_NAME,
    process.env.BCO_CONTRACT_ADDRESS
  )
  console.log(`New BCO ownership: ${await bco.owner()}`)
  console.log(`BCO ownership has been renounced.`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
