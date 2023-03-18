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
    string constant ERR_EMPTY_TASK_NAME = "ERR_EMPTY_TASK_NAME";
    string constant ERR_ZERO_ASSIGNER_ADDRESS = "ERR_ZERO_ASSIGNER_ADDRESS";
    string constant ERR_EMPTY_REVIEWERS = "ERR_EMPTY_REVIEWERS";
    string constant ERR_ZERO_REVIEWER = "ERR_ZERO_REVIEWER";

    string constant ERR_DAO_NOT_FOUND = "ERR_DAO_NOT_FOUND";
    string constant ERR_TASK_NOT_FOUND = "ERR_TASK_NOT_FOUND";

    string constant ERR_NOT_DAO_MEMBER = "ERR_NOT_DAO_MEMBER";
    string constant ERR_NOT_TASK_ASSIGNER = "ERR_NOT_TASK_ASSIGNER";
    string constant ERR_NOT_TASK_REVIEWER = "ERR_NOT_TASK_REVIEWER";
    string constant ERR_TASK_NOT_STARTED = "ERR_TASK_NOT_STARTED";
    string constant ERR_TASK_ALREADY_STARTED = "ERR_TASK_ALREADY_STARTED";
    string constant ERR_TASK_ALREADY_COMPLETED = "ERR_TASK_ALREADY_COMPLETED";
    string constant ERR_TASK_NOT_IN_PROGRESS = "ERR_TASK_NOT_IN_PROGRESS";
    string constant ERR_TASK_NOT_IN_REVIEW = "ERR_TASK_NOT_IN_REVIEW";
    string constant ERR_TASK_ALREADY_APPROVED = "ERR_TASK_ALREADY_APPROVED";
    string constant ERR_TASK_NOT_ENOUGH_SCORES = "ERR_TASK_NOT_ENOUGH_SCORES";

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
        address assigner;
    }

    struct TaskThread {
        address createdBy;
        TaskThreadType threadType;
        string messageURI;
        bool isPrivate; // これできる？
    }

    // State variables
    Counters.Counter private _daoIDs;

    mapping(uint256 => DAO) private _daos; // DAO ID => DAO

    mapping(uint256 => EnumerableSet.AddressSet) private _daoMembers; // DAO ID => Address Set

    mapping(uint256 => Counters.Counter) private _taskIDs; // DAO ID => Counter

    mapping(uint256 => mapping(uint256 => Task)) private _tasks; // DAO ID => Task ID => Task

    mapping(uint256 => mapping(uint256 => EnumerableSet.AddressSet))
        private _reviewers;

    mapping(uint256 => mapping(uint256 => EnumerableSet.AddressSet))
        private _taskApprovals; // DAO ID => Task ID => Approver set

    mapping(uint256 => mapping(uint256 => Counters.Counter)) private _threadIDs; // DAO ID => Task ID => Counter

    mapping(uint256 => mapping(uint256 => mapping(uint256 => TaskThread)))
        private _taskThreads; // DAO ID => Task ID => Thread ID => TaskThread

    mapping(uint256 => mapping(uint256 => mapping(address => mapping(uint256 => uint256)))) _skillScores;
    // DAO ID => Task ID => address => skill index => score

    // Events
    event DAOCreated(
        uint256 daoID,
        string name,
        string metadataURI,
        bool isPrivate,
        address createdBy
    );

    event DAOMembersAdded(uint256 indexed daoID, address[] members);

    event TaskCreated(
        uint256 indexed daoID,
        uint256 taskID,
        TaskStatus status,
        string name,
        string metadataURI,
        bool isPrivate,
        string[] skills,
        address createdBy
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

    event TaskCommented(
        uint256 indexed daoID,
        uint256 indexed taskID,
        uint256 threadID,
        address createdBy,
        string messageURI,
        bool isPrivate
    );

    event ReviewRequested(
        uint256 indexed daoID,
        uint256 indexed taskID,
        uint256 threadID,
        address requestedBy,
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
        uint256 threadID,
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
        require(
            _tasks[daoID][taskID].createdBy != address(0x0),
            ERR_TASK_NOT_FOUND
        );
        _;
    }

    modifier isDAOMember(uint256 daoID, address account) {
        require(_isDAOMember(daoID, account), ERR_NOT_DAO_MEMBER);
        _;
    }

    modifier isTaskAssigner(
        uint256 daoID,
        uint256 taskID,
        address account
    ) {
        require(
            _tasks[daoID][taskID].assigner == account,
            ERR_NOT_TASK_ASSIGNER
        );
        _;
    }

    modifier isTaskReviewer(
        uint256 daoID,
        uint256 taskID,
        address account
    ) {
        require(
            _reviewers[daoID][taskID].contains(account),
            ERR_NOT_TASK_REVIEWER
        );
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
    ) external whenNotPaused daoExists(daoID) isDAOMember(daoID, msg.sender) {
        return _addMembers(daoID, newMembers);
    }

    function createTask(
        uint256 daoID,
        string memory name,
        string memory metadataURI,
        bool isPrivate,
        TaskStatus taskStatus,
        string[] memory skills,
        address assigner,
        address[] memory reviewers
    ) external whenNotPaused daoExists(daoID) isDAOMember(daoID, msg.sender) {
        _createTask(
            daoID,
            name,
            metadataURI,
            isPrivate,
            taskStatus,
            skills,
            assigner,
            reviewers
        );
    }

    function assignAssigner(
        uint256 daoID,
        uint256 taskID,
        address assigner
    )
        external
        whenNotPaused
        daoExists(daoID)
        taskExists(daoID, taskID)
        isDAOMember(daoID, msg.sender)
    {
        _assignAssigner(daoID, taskID, assigner);
    }

    function assignReviewers(
        uint256 daoID,
        uint256 taskID,
        address[] memory reviewers
    )
        external
        whenNotPaused
        daoExists(daoID)
        taskExists(daoID, taskID)
        isDAOMember(daoID, msg.sender)
    {
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
        return _daoIDs.current();
    }

    function numberOfTasks(uint256 daoID) public view returns (uint256) {
        return _taskIDs[daoID].current();
    }

    function numberOfThreads(
        uint256 daoID,
        uint256 taskID
    ) public view returns (uint256) {
        return _threadIDs[daoID][taskID].current();
    }

    function taskStatus(
        uint256 daoID,
        uint256 taskID
    ) public view returns (TaskStatus) {
        return _tasks[daoID][taskID].status;
    }

    // 特定のDAOの中の活動がaccountが見えるかどうか
    function canViewDAO(
        uint256 daoID,
        address account
    ) public view returns (bool) {
        return !_daos[daoID].isPrivate || _daoMembers[daoID].contains(account);
    }

    // 特定のDAOの中のTaskの中の活動がaccountに見えるかどうか
    function canViewTask(
        uint256 daoID,
        uint256 taskID,
        address account
    ) public view returns (bool) {
        // TODO: assignしてから見えるようにするとかすると面白いかも？
        if (!canViewDAO(daoID, account)) {
            return false;
        }

        return _tasks[daoID][taskID].isPrivate;
    }

    // XXX: 暗号化できるのは
    // taskMetadata
    // threadMetadata
    // messageURI指定にすればいける

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

        emit DAOCreated(daoID, name, metadataURI, isPrivate, msg.sender);

        _addMembers(daoID, members);

        return daoID;
    }

    function _addMembers(uint256 daoID, address[] memory members) internal {
        for (uint256 i = 0; i < members.length; i++) {
            _daoMembers[daoID].add(members[i]);
        }

        emit DAOMembersAdded(daoID, members);
    }

    function _createTask(
        uint256 daoID,
        string memory name,
        string memory metadataURI,
        bool isPrivate,
        TaskStatus taskStatus,
        string[] memory skills,
        address assigner,
        address[] memory reviewers
    ) internal {
        require(!_isStringEmpty(name), ERR_EMPTY_TASK_NAME);
        require(_daoMembers[daoID].contains(msg.sender), ERR_NOT_DAO_MEMBER);

        require(_isDAOMember(daoID, assigner), ERR_NOT_DAO_MEMBER);
        for (uint256 i = 0; i < reviewers.length; i++) {
            require(_isDAOMember(daoID, reviewers[i]), ERR_NOT_DAO_MEMBER);
        }

        uint256 taskID = _taskIDs[daoID].current();
        _taskIDs[daoID].increment();

        _tasks[daoID][taskID] = Task({
            createdBy: msg.sender,
            status: taskStatus,
            name: name,
            metadataURI: metadataURI,
            isPrivate: isPrivate,
            skills: skills,
            assigner: address(0x0)
        });

        emit TaskCreated(
            daoID,
            taskID,
            taskStatus,
            name,
            metadataURI,
            isPrivate,
            skills,
            msg.sender
        );

        if (assigner != address(0x0)) {
            _assignAssigner(daoID, taskID, assigner);
        }

        if (reviewers.length > 0) {
            _assignReviewers(daoID, taskID, reviewers);
        }
    }

    function _assignAssigner(
        uint256 daoID,
        uint256 taskID,
        address assigner
    ) internal {
        require(
            _tasks[daoID][taskID].status != TaskStatus.Done,
            ERR_TASK_ALREADY_COMPLETED
        );
        require(assigner != address(0x0), ERR_ZERO_ASSIGNER_ADDRESS);

        _tasks[daoID][taskID].assigner = assigner;

        emit AssignerAssigned(daoID, taskID, assigner);
    }

    function _assignReviewers(
        uint256 daoID,
        uint256 taskID,
        address[] memory reviewers
    ) internal {
        require(
            _tasks[daoID][taskID].status != TaskStatus.Done,
            ERR_TASK_ALREADY_COMPLETED
        );
        require(reviewers.length > 0, ERR_EMPTY_REVIEWERS);
        for (uint256 i = 0; i < reviewers.length; i++) {
            require(reviewers[i] != address(0x0), ERR_ZERO_REVIEWER);

            _reviewers[daoID][taskID].add(reviewers[i]);
        }

        emit ReviewersAssigned(daoID, taskID, reviewers);
    }

    function _startTask(uint256 daoID, uint256 taskID) internal {
        require(
            _tasks[daoID][taskID].status == TaskStatus.TODO,
            ERR_TASK_ALREADY_STARTED
        );
        require(
            _tasks[daoID][taskID].assigner == msg.sender,
            ERR_NOT_TASK_ASSIGNER
        );

        _tasks[daoID][taskID].status = TaskStatus.InProgress;

        emit TaskStarted(daoID, taskID);
    }

    function _addComment(
        uint256 daoID,
        uint256 taskID,
        string memory messageURI,
        bool isPrivate
    ) internal {
        require(_daoMembers[daoID].contains(msg.sender), ERR_NOT_DAO_MEMBER);

        uint256 threadID = _addThread(
            daoID,
            taskID,
            TaskThreadType.Comment,
            messageURI,
            isPrivate
        );

        emit TaskCommented(
            daoID,
            taskID,
            threadID,
            msg.sender,
            messageURI,
            isPrivate
        );
    }

    function _requestTaskReview(
        uint256 daoID,
        uint256 taskID,
        string memory messageURI,
        bool isPrivate
    ) internal {
        require(
            _tasks[daoID][taskID].assigner == msg.sender,
            ERR_NOT_TASK_ASSIGNER
        );
        require(
            _tasks[daoID][taskID].status == TaskStatus.InProgress,
            ERR_TASK_NOT_IN_PROGRESS
        );

        _tasks[daoID][taskID].status = TaskStatus.InReview;

        uint256 threadID = _addThread(
            daoID,
            taskID,
            TaskThreadType.ReviewRequest,
            messageURI,
            isPrivate
        );

        emit ReviewRequested(
            daoID,
            taskID,
            threadID,
            msg.sender,
            messageURI,
            isPrivate
        );
    }

    function _requestChanges(
        uint256 daoID,
        uint256 taskID,
        string memory messageURI,
        bool isPrivate
    ) internal {
        require(
            _reviewers[daoID][taskID].contains(msg.sender),
            ERR_NOT_TASK_REVIEWER
        );
        require(
            _tasks[daoID][taskID].status != TaskStatus.TODO,
            ERR_TASK_NOT_STARTED
        );
        require(
            _tasks[daoID][taskID].status != TaskStatus.Done,
            ERR_TASK_ALREADY_COMPLETED
        );

        _tasks[daoID][taskID].status = TaskStatus.InProgress;

        uint256 threadID = _addThread(
            daoID,
            taskID,
            TaskThreadType.ChangesRequest,
            messageURI,
            isPrivate
        );

        _taskApprovals[daoID][taskID].remove(msg.sender);

        emit RequestedChanges(
            daoID,
            taskID,
            threadID,
            msg.sender,
            messageURI,
            isPrivate
        );
    }

    function _approveTask(
        uint256 daoID,
        uint256 taskID,
        string memory messageURI,
        bool isPrivate,
        uint256[] memory scores
    ) internal {
        require(
            _reviewers[daoID][taskID].contains(msg.sender),
            ERR_NOT_TASK_REVIEWER
        );
        require(
            _tasks[daoID][taskID].status == TaskStatus.InReview,
            ERR_TASK_NOT_IN_REVIEW
        );
        require(
            _tasks[daoID][taskID].skills.length == scores.length,
            ERR_TASK_NOT_ENOUGH_SCORES
        );

        // add approvals
        require(
            _taskApprovals[daoID][taskID].add(msg.sender),
            ERR_TASK_ALREADY_APPROVED
        );

        for (uint256 i = 0; i < scores.length; i++) {
            _skillScores[daoID][taskID][msg.sender][i] = scores[i];
        }

        uint256 threadID = _addThread(
            daoID,
            taskID,
            TaskThreadType.Approve,
            messageURI,
            isPrivate
        );

        emit TaskApproved(
            daoID,
            taskID,
            threadID,
            msg.sender,
            messageURI,
            isPrivate,
            scores
        );

        if (
            _taskApprovals[daoID][taskID].length() ==
            _reviewers[daoID][taskID].length()
        ) {
            _tasks[daoID][taskID].status = TaskStatus.Done;

            emit TaskCompleted(daoID, taskID);
        }
    }

    // Private functions
    function _addThread(
        uint256 daoID,
        uint256 taskID,
        TaskThreadType threadType,
        string memory messageURI,
        bool isPrivate
    ) private returns (uint256) {
        uint256 threadID = _threadIDs[daoID][taskID].current();
        _threadIDs[daoID][taskID].increment();

        _taskThreads[daoID][taskID][threadID] = TaskThread({
            createdBy: msg.sender,
            threadType: threadType,
            messageURI: messageURI,
            isPrivate: isPrivate
        });

        return threadID;
    }

    function _isStringEmpty(string memory str) private pure returns (bool) {
        bytes memory bytesData = bytes(str);

        return bytesData.length == 0;
    }

    function _isDAOMember(
        uint256 daoID,
        address account
    ) private view returns (bool) {
        return _daoMembers[daoID].contains(account);
    }
}
