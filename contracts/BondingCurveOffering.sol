//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

import "./BondingCurve.sol";

contract BondingCurveOffering is BondingCurve {
    using SafeMath for uint256;

    event Trade(
        uint256 indexed _isBuy,
        uint256 indexed _amount,
        uint256 indexed _token
    );

    IERC20 private usdt;
    IERC20 private token;
    uint256 private constant MAX_WEIGHT = 1000000;
    uint256 private constant USDT_DIGITS = 6;
    
    address public beneficiary;
    uint256 public rate;
    uint256 public scale;
    uint256 public collateralRate;

    constructor(
        address _token_address,
        uint256 _token_decimals,
        uint256 _rate,
        uint256 _supply,
        address _beneficiary,
        uint256 _taxRate,
        uint256 _connectorWeight
    ) BondingCurve(_supply, _connectorWeight) {
        usdt = IERC20(0xc2132D05D31c914a87C6611C10748AEb04B58e8F);
        token = IERC20(_token_address);
        beneficiary = _beneficiary;
        scale = 10**(_token_decimals - USDT_DIGITS);
        rate = _rate * scale;
        collateralRate = MAX_WEIGHT - _taxRate;
    }

    function updateBeneficiary(address _beneficiary) public onlyOwner
    {
         require(_beneficiary != beneficiary, "The new beneficiary address must be different!");
         beneficiary = _beneficiary;
    }

    function _safeTransferFrom(
        IERC20 _token,
        address _sender,
        uint256 _amount
    ) private {
        bool sent = _token.transferFrom(_sender, address(this), _amount);
        require(sent, "Token transfer failed");
    }

    modifier validBuy(uint256 _amount) {
        require(_amount > 0, "You need to send some USDT");
        require(
            usdt.allowance(msg.sender, address(this)) >= _amount,
            "Not enough USDT allowance in your account"
        );
        uint256 _tokens = calculateBuyAmount(_amount);
        require(_tokens > 0, "The quantity you buy is too small");
        require(
            token.balanceOf(address(this)) >= _tokens,
            "Token is not enough for you"
        );
        _;
    }

    modifier validSell(uint256 _tokens) {
        require(_tokens > 0, "You need to send some tokens");
        require(
            token.balanceOf(msg.sender) >= _tokens,
            "Not enough tokens in your account"
        );
        uint256 _amount = calculateReimbursement(_tokens);
        require(_amount > 0, "The quantity you sell is too small");
        require(
            usdt.balanceOf(address(this)) >= _amount / rate,
            "USDT is not enough for you"
        );
        _;
    }

    function calculateBuyAmount(uint256 _amount)
        public
        view
        returns (uint256 _tokens)
    {
        return _calculateBuyAmount(_afterTaxedRated(_amount));
    }

    function calculateReimbursement(uint256 _tokens)
        public
        view
        returns (uint256 _amount)
    {
        return _calculateReimbursement(_tokens);
    }

    function Purchase(uint256 _amount) public validBuy(_amount) {
        _safeTransferFrom(usdt, msg.sender, _amount);
        uint256 _tokens = _purchase(_afterTaxedRated(_amount));
        token.transfer(msg.sender, _tokens);
        usdt.transfer(beneficiary, tax(_amount));
        emit Trade(1, _amount, _tokens);
    }

    function Reimbursement(uint256 _tokens) public validSell(_tokens) {
        _safeTransferFrom(token, msg.sender, _tokens);
        uint256 _refund = _reimbursement(_tokens);
        uint256 _amount = _refund / rate;
        usdt.transfer(msg.sender, _amount);
        emit Trade(0, _amount, _tokens);
    }

    function _afterTaxedRated(uint256 _amount)
        internal
        view
        returns (uint256 _aftertax_amount)
    {
        return collateralRate * (rate / MAX_WEIGHT) * _amount;
    }

    function tax(uint256 _amount) public view returns (uint256 _tax) {
        return (_amount * rate - _afterTaxedRated(_amount)) / rate;
    }
}
