// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

pragma abicoder v2;


/**
 * @title Interface for Collection Contract
 */
interface IDIAOracle {
 function getValue(string memory key) 
 external 
 view 
 returns (uint128, uint128);
}