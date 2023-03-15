// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract TrustX is Initializable, PausableUpgradeable {
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.AddressSet;

    // Type declarations
    // errors
    string constant ERR_EMPTY_DAO_NAME = "ERR_EMPTY_DAO_NAME";

    string constant ERR_DAO_NOT_FOUND = "ERR_DAO_NOT_FOUND";

    // enums
    // structs
    struct DAO {
        address createdBy;
        string name;
        string metadataURI;
        bool isPrivate;
    }

    // State variables
    Counters.Counter private _daoIDs;

    mapping(uint256 => DAO) private _daos; // DAO ID => DAO

    mapping(uint256 => EnumerableSet.AddressSet) private _daoMembers; // DAO ID => Address Set

    // Events
    event DAOCreated(
        uint256 daoID,
        string name,
        string metadataURI,
        bool isPrivate
    );

    event DAOMembersAdded(uint256 indexed daoID, address[] members);

    // Modifiers
    modifier daoExists(uint256 daoID) {
        require(_daos[daoID].createdBy != address(0x0), ERR_DAO_NOT_FOUND);
        _;
    }

    // constructor
    constructor() {}

    function initialize() public initializer {}

    // External functions
    function createDAO(
        string memory name,
        string memory metadataURI,
        bool isPrivate,
        address[] memory members
    ) external whenNotPaused returns (uint256) {
        return _createDAO(name, metadataURI, isPrivate, members);
    }

    function addMembers(
        uint256 daoID,
        address[] memory newMembers
    ) external whenNotPaused daoExists(daoID) {
        return _addMembers(daoID, newMembers);
    }

    // External functions that are view

    // External functions that are pure

    // Public functions

    // Internal functions
    function _createDAO(
        string memory name,
        string memory metadataURI,
        bool isPrivate,
        address[] memory members
    ) internal returns (uint256) {
        require(!_isStringEmpty(name), ERR_EMPTY_DAO_NAME);

        uint256 daoID = _daoIDs.current();
        _daoIDs.increment();

        _daos[daoID] = DAO({
            createdBy: msg.sender,
            name: name,
            metadataURI: metadataURI,
            isPrivate: isPrivate
        });

        _daoMembers[daoID].add(msg.sender);

        emit DAOCreated(daoID, name, metadataURI, isPrivate);

        _addMembers(daoID, members);

        return daoID;
    }

    function _addMembers(uint256 daoID, address[] memory members) internal {
        for (uint256 i = 0; i < members.length; i++) {
            _daoMembers[daoID].add(members[i]);
        }

        emit DAOMembersAdded(daoID, members);
    }

    // Private functions
    function _isStringEmpty(string memory str) private pure returns (bool) {
        bytes memory bytesData = bytes(str);

        return bytesData.length == 0;
    }
}
