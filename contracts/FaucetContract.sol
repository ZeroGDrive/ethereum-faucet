// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Owned.sol";
import "./Logger.sol";
import "./IFaucet.sol";

contract Faucet is Owned, Logger, IFaucet {

    uint public totalFunders;
    
    mapping(address => bool) public funders;
    mapping(uint => address) public lutFunders;

    modifier limitWithdraw(uint amount) {
        require(amount <= 100000000000000000, "Amount too large");
        _;
    }

    // this is a special function
    // it's called when you make a transaction and doesn't specify function name to call

    // external functions are part of the contract interface
    // and can be called from other contracts

    // payable means that it can receive ether into this contract

    receive() external payable {}

    function addFunds() external payable {
        if (!funders[msg.sender]) {
            lutFunders[totalFunders++] = msg.sender;
            funders[msg.sender] = true;
        }
    }

    function emitLog() public override pure returns (bytes32) {
        return "Hello World";
    }

    function withdraw(uint amount) external limitWithdraw(amount) {
        payable(msg.sender).transfer(amount);
    }

    function getFunderAtIndex(uint256 index) external view onlyOwner() returns (address) {
        return lutFunders[index];
    }

    function getAllFunders() external view returns (address[] memory) {
        address[] memory _funders = new address[](totalFunders);
        for (uint i = 0; i < totalFunders; i++) {
            _funders[i] = lutFunders[i];
        }
        return _funders;
    }
}

// const instance = await Faucet.deployed();
// instance.addFunds({value: "1000000000000000000", from: accounts[0]});
// instance.addFunds({value: "1000000000000000000", from: accounts[1]});
// instance.getFunderAtIndex(0);
// instance.getAllFunders();
// instance.withdraw(500000000000000000, {from: accounts[1]});