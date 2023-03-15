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
    enum TaskStatus {
        TODO,
        InProgress,
        InReview,
        Done
    }

    enum TaskThreadType {
        Comment,
        ReviewRequest,
        ChangesRequest,
        Approve
    }

    // structs
    struct DAO {
        address createdBy;
        string name;
        string metadataURI;
        bool isPrivate;
    }

    struct Task {
        address createdBy;
        TaskStatus status;
        string name;
        string metadataURI;
        bool isPrivate;
        string[] skills;
    }

    struct TaskThread {
        address createdBy;
        TaskThreadType threadType;
        string messageURI;
        bool isPrivate;
    }

    // State variables
    Counters.Counter private _daoIDs;

    mapping(uint256 => DAO) private _daos; // DAO ID => DAO

    mapping(uint256 => EnumerableSet.AddressSet) private _daoMembers; // DAO ID => Address Set

    mapping(uint256 => Counters.Counter) private _taskIDs; // DAO ID => Counter

    mapping(uint256 => mapping(uint256 => Task)) private _tasks; // DAO ID => Task ID => Task

    mapping(uint256 => mapping(uint256 => Counters.Counter)) private _threadIDs; // DAO ID => Task ID => Counter

    mapping(uint256 => mapping(uint256 => mapping(uint256 => TaskThread)))
        private _taskThreads; // DAO ID => Task ID => Thread ID => TaskThread

    // Events
    event DAOCreated(
        uint256 daoID,
        string name,
        string metadataURI,
        bool isPrivate
    );

    event DAOMembersAdded(uint256 indexed daoID, address[] members);

    event TaskCreated(
        uint256 indexed daoID,
        uint256 taskID,
        string name,
        string metadataURI,
        bool isPrivate,
        string[] skills
    );

    event AssignerAssigned(
        uint256 indexed daoID,
        uint256 indexed taskID,
        address assigner
    );

    event ReviewersAssigned(
        uint256 indexed daoID,
        uint256 indexed taskID,
        address[] reviewers
    );

    event TaskStarted(uint256 indexed daoID, uint256 indexed taskID);

    event ReviewRequested(
        uint256 indexed daoID,
        uint256 indexed taskID,
        uint256 threadID,
        string messageURI,
        bool isPrivate
    );

    event RequestedChanges(
        uint256 indexed daoID,
        uint256 indexed taskID,
        uint256 threadID,
        address requestedBy,
        string messageURI,
        bool isPrivate
    );

    event TaskApproved(
        uint256 indexed daoID,
        uint256 indexed taskID,
        address approvedBy,
        string messageURI,
        bool isPrivate,
        uint256[] scores
    );

    event TaskCompleted(uint256 indexed daoID, uint256 indexed taskID);

    // Modifiers
    modifier daoExists(uint256 daoID) {
        require(_daos[daoID].createdBy != address(0x0), ERR_DAO_NOT_FOUND);
        _;
    }

    modifier taskExists(uint256 daoID, uint256 taskID) {
        // TODO: implement
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

    function creataTask(
        uint256 daoID,
        string memory name,
        string memory metadataURI,
        bool isPrivate,
        string[] memory skills,
        address assigner,
        address[] memory reviewers
    ) external whenNotPaused daoExists(daoID) {
        _creataTask(
            daoID,
            name,
            metadataURI,
            isPrivate,
            skills,
            assigner,
            reviewers
        );
    }

    function assignAssigner(
        uint256 daoID,
        uint256 taskID,
        address assigner
    ) external whenNotPaused daoExists(daoID) taskExists(daoID, taskID) {
        _assignAssigner(daoID, taskID, assigner);
    }

    function assignReviewers(
        uint256 daoID,
        uint256 taskID,
        address[] memory reviewers
    ) external whenNotPaused daoExists(daoID) taskExists(daoID, taskID) {
        _assignReviewers(daoID, taskID, reviewers);
    }

    function startTask(
        uint256 daoID,
        uint256 taskID
    ) external whenNotPaused daoExists(daoID) taskExists(daoID, taskID) {
        _startTask(daoID, taskID);
    }

    function addComment(
        uint256 daoID,
        uint256 taskID,
        string memory messageURI,
        bool isPrivate
    ) external whenNotPaused daoExists(daoID) taskExists(daoID, taskID) {
        _addComment(daoID, taskID, messageURI, isPrivate);
    }

    function requestTaskReview(
        uint256 daoID,
        uint256 taskID,
        string memory messageURI,
        bool isPrivate
    ) external whenNotPaused daoExists(daoID) taskExists(daoID, taskID) {
        _requestTaskReview(daoID, taskID, messageURI, isPrivate);
    }

    function requestChanges(
        uint256 daoID,
        uint256 taskID,
        string memory messageURI,
        bool isPrivate
    ) external whenNotPaused daoExists(daoID) taskExists(daoID, taskID) {
        _requestChanges(daoID, taskID, messageURI, isPrivate);
    }

    function approveTask(
        uint256 daoID,
        uint256 taskID,
        string memory messageURI,
        bool isPrivate,
        uint256[] memory scores
    ) external whenNotPaused daoExists(daoID) taskExists(daoID, taskID) {
        _approveTask(daoID, taskID, messageURI, isPrivate, scores);
    }

    // External functions that are view
    function numberOfDAOs() public view returns (uint256) {
        // TODO: implement
        return 0;
    }

    function numberOfTasks(uint256 daoID) public view returns (uint256) {
        // TODO: implement
        return 0;
    }

    function numberOfThreads(
        uint256 daoID,
        uint256 taskID
    ) public view returns (uint256) {
        // TODO: implement
        return 0;
    }

    function taskStatus(
        uint256 daoID,
        uint256 taskID
    ) public view returns (TaskStatus) {
        // TODO: implement
        return TaskStatus.TODO;
    }

    // 特定のDAOの中の活動がaccountが見えるかどうか
    function canViewDAO(
        uint256 daoID,
        address account
    ) public view returns (bool) {
        // TODO: implement
        return false;
    }

    // 特定のDAOの中のTaskの中の活動がaccountに見えるかどうか
    function canViewTask(
        uint256 daoID,
        uint256 taskID,
        address account
    ) public view returns (bool) {
        // TODO: implement
        // assignしてから見えるようにするとかすると面白いかも？
        return false;
    }

    // XXX: 暗号化できるのは
    // taskMetadata
    // threadMetadata

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

    function _creataTask(
        uint256 daoID,
        string memory name,
        string memory metadataURI,
        bool isPrivate,
        string[] memory skills,
        address assigner,
        address[] memory reviewers
    ) internal {
        // TODO: implement
    }

    function _assignAssigner(
        uint256 daoID,
        uint256 taskID,
        address assigner
    ) internal {
        // TODO: implement
        // XXX: task must not be completed
    }

    function _assignReviewers(
        uint256 daoID,
        uint256 taskID,
        address[] memory reviewers
    ) internal {
        // TODO: implement
        // XXX: task must not be completed
    }

    function _startTask(uint256 daoID, uint256 taskID) internal {
        // TODO: implement
        // XXX: task must not be completed
        // XXX: must be called from assigner
    }

    function _addComment(
        uint256 daoID,
        uint256 taskID,
        string memory messageURI,
        bool isPrivate
    ) internal {
        // TODO: implement
        // XXX: task must not be completed
        // XXX: must be called from assigner
    }

    function _requestTaskReview(
        uint256 daoID,
        uint256 taskID,
        string memory messageURI,
        bool isPrivate
    ) internal {
        // TODO: implement
        // XXX: task must not be completed
        // XXX: must be called from assigner
    }

    function _requestChanges(
        uint256 daoID,
        uint256 taskID,
        string memory messageURI,
        bool isPrivate
    ) internal {
        // TODO: implement
        // XXX: task must not be completed
        // XXX: must be called from assigner
    }

    function _approveTask(
        uint256 daoID,
        uint256 taskID,
        string memory messageURI,
        bool isPrivate,
        uint256[] memory scores
    ) internal {
        // TODO: implement
        // XXX: task must not be completed
        // XXX: must be called from assigner
    }

    // Private functions
    function _isStringEmpty(string memory str) private pure returns (bool) {
        bytes memory bytesData = bytes(str);

        return bytesData.length == 0;
    }
}
