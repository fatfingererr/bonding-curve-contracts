const hre = require("hardhat");
const args = require("../../arguments/BondingCurveOffering");

async function main() {

    // 1. 建立合約
    const BCO = await hre.ethers.getContractFactory("BondingCurveOffering");

    // 2. 初始化設定
    const bco = await BCO.deploy(...args);

    // 3. 佈署合約
    await bco.deployed();

    // 4. 確認地址
    console.log(`BondingCurveOffering deployed to: ${bco.address}\n`);
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
