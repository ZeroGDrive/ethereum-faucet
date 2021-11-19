// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Faucet {

    address[] public funders;

    // this is a special function
    // it's called when you make a transaction and doesn't specify function name to call

    // external functions are part of the contract interface
    // and can be called from other contracts

    // payable means that it can receive ether into this contract

    receive() external payable {}

    function addFunds() external payable {
        funders.push(msg.sender);
    }

    function getAllFunders() external view returns (address[] memory) {
        return funders;
    }

    function getFunderAtIndex(uint256 index) external view returns (address) {
        return funders[index];
    }
}