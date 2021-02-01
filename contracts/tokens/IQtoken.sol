// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;

interface IQtoken {
    // --- Read Functions -------------------------

    function realtimeBalanceOf(address account, uint256 timestamp) external;

    function getUnderlyingToken() external view returns (address);

    // --- Write Functions ------------------------

    /**
    @dev Mints tokens for demo purposes. Should follow same process as upgrading tokens
    */
    function demoMint(address account, uint256 amount) external;

    function upgrade(uint256 amount) external;

    function operatorUpgrade(address account, uint256 amount) external;

    function downgrade(uint256 amount) external;

    function operatorDowngrade(address account, uint256 amount) external;
}