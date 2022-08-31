const hre = require("hardhat");
const args = require("../../arguments/ERC20Token");

async function main() {

    // 1. 建立合約
    const Token = await hre.ethers.getContractFactory("ERC20Token");

    // 2. 初始化設定
    const token = await Token.deploy(...args);

    // 3. 佈署合約
    await token.deployed();

    // 4. 確認地址
    console.log(`ERC20Token deployed to: ${token.address}\n`);
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
