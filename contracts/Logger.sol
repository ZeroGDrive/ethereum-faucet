// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// abstract is a way to designer to say that any child class must implement the specified methods

abstract contract Logger {
    function emitLog() public pure virtual returns (bytes32);
}