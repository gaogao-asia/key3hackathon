// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract TrustXACL is ERC1155 {
    constructor() ERC1155("https://game.example/api/item/{id}.json") {}

    function addMembers(uint256 daoID, address[] memory newMembers) external {
        return _addMembers(daoID, newMembers);
    }

    function _addMembers(uint256 daoID, address[] memory members) internal {
        for (uint256 i = 0; i < members.length; i++) {
            _mint(members[i], daoID, 1, "");
        }
    }
}
