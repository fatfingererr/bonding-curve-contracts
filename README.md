# Bonding Curve Contracts 

The purpose of this repository is to help the open source project owner to issue their project token for fundraising. The project distributes the token via Bonding Curve Offering (BCO).

## Getting started

### Installation

```sh 
git clone https://github.com/fatfingererr/bonding-curve-contracts.git
cd bonding-curve-contracts
npm install
cp .env.example .env
# Please fill in the empty fileds in .env
```

### Getting started

```sh
npm run token:deploy
npm run bco:deploy
# >> Verify contracts
npm run token:transfer:initsupply
npm run token:ownership:renounce 
```

### Purchase & Reimbursement

```sh
# Purchase (USDT->TOKEN)
# Change "amount" in scripts/bco/Purchase.js
npm run bco:buy

# Reimbursement (TOKEN->USDT)
# Change "amount" in scripts/bco/Reimbursement.js
npm run bco:sell
```

## Basic usages

### Compile contracts

```sh
npm run compile
```

### Verify contracts

```sh
npx hardhat verify TOKEN_ADDRESS --network matic --constructor-args arguments/ERC20Token.js
npx hardhat verify BCO_ADDRESS --network matic --constructor-args arguments/BondingCurveOffering.js
```

### Clean cache

```sh
npm run clean
```