//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";

import "./BancorFormula.sol";
import "./MaxGasPrice.sol";

contract BondingCurve is BancorFormula, Ownable, MaxGasPrice {
    using SafeMath for uint256;

    uint256 public balance;
    uint256 public connectorWeight;
    uint256 public supply;
    uint256 private scale = 10**12;

    constructor(uint256 _supply, uint256 _connectorWeight) {
        supply = _supply * scale;
        balance = supply;
        connectorWeight = _connectorWeight;
    }

    function _calculateBuyAmount(uint256 _amount)
        internal
        view
        returns (uint256 mintAmount)
    {
        return
            calculatePurchaseReturn(
                supply,
                balance,
                uint32(connectorWeight),
                _amount
            );
    }

    function _calculateReimbursement(uint256 _amount)
        internal
        view
        returns (uint256 burnAmount)
    {
        return
            calculateSaleReturn(supply, balance, uint32(connectorWeight), _amount);
    }

    function _purchase(uint256 _deposit) internal returns (uint256) {
        uint256 amount = _calculateBuyAmount(_deposit);
        supply = supply.add(amount);
        balance = balance.add(_deposit);
        return amount;
    }

    function _reimbursement(uint256 _amount) internal returns (uint256) {
        uint256 reimbursement = _calculateReimbursement(_amount);
        balance = balance.sub(reimbursement);
        return reimbursement;
    }
}
