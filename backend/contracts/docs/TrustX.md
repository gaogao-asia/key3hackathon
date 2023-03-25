# TrustX









## Methods

### addComment

```solidity
function addComment(uint256 daoID, uint256 taskID, string messageURI, bool isPrivate) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID | uint256 | undefined |
| taskID | uint256 | undefined |
| messageURI | string | undefined |
| isPrivate | bool | undefined |

### addMembers

```solidity
function addMembers(uint256 daoID, address[] newMembers) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID | uint256 | undefined |
| newMembers | address[] | undefined |

### approveTask

```solidity
function approveTask(uint256 daoID, uint256 taskID, string messageURI, bool isPrivate, uint256[] scores) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID | uint256 | undefined |
| taskID | uint256 | undefined |
| messageURI | string | undefined |
| isPrivate | bool | undefined |
| scores | uint256[] | undefined |

### assignAssigner

```solidity
function assignAssigner(uint256 daoID, uint256 taskID, address assigner) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID | uint256 | undefined |
| taskID | uint256 | undefined |
| assigner | address | undefined |

### assignReviewers

```solidity
function assignReviewers(uint256 daoID, uint256 taskID, address[] reviewers) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID | uint256 | undefined |
| taskID | uint256 | undefined |
| reviewers | address[] | undefined |

### canViewDAO

```solidity
function canViewDAO(uint256 daoID, address account) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID | uint256 | undefined |
| account | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### canViewTask

```solidity
function canViewTask(uint256 daoID, uint256 taskID, address account) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID | uint256 | undefined |
| taskID | uint256 | undefined |
| account | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### createDAO

```solidity
function createDAO(string name, string metadataURI, bool isPrivate, address[] members) external nonpayable returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| name | string | undefined |
| metadataURI | string | undefined |
| isPrivate | bool | undefined |
| members | address[] | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### createTask

```solidity
function createTask(uint256 daoID, string name, string metadataURI, bool isPrivate, enum TrustX.TaskStatus taskStatus, string[] skills, address assigner, address[] reviewers) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID | uint256 | undefined |
| name | string | undefined |
| metadataURI | string | undefined |
| isPrivate | bool | undefined |
| taskStatus | enum TrustX.TaskStatus | undefined |
| skills | string[] | undefined |
| assigner | address | undefined |
| reviewers | address[] | undefined |

### initialize

```solidity
function initialize(address bridgeAddress, uint8 bridgeDestinationDomainID, bytes32 birdgeResourceID) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| bridgeAddress | address | undefined |
| bridgeDestinationDomainID | uint8 | undefined |
| birdgeResourceID | bytes32 | undefined |

### numberOfDAOs

```solidity
function numberOfDAOs() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### numberOfTasks

```solidity
function numberOfTasks(uint256 daoID) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### numberOfThreads

```solidity
function numberOfThreads(uint256 daoID, uint256 taskID) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID | uint256 | undefined |
| taskID | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### paused

```solidity
function paused() external view returns (bool)
```



*Returns true if the contract is paused, and false otherwise.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### requestChanges

```solidity
function requestChanges(uint256 daoID, uint256 taskID, string messageURI, bool isPrivate) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID | uint256 | undefined |
| taskID | uint256 | undefined |
| messageURI | string | undefined |
| isPrivate | bool | undefined |

### requestTaskReview

```solidity
function requestTaskReview(uint256 daoID, uint256 taskID, string messageURI, bool isPrivate) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID | uint256 | undefined |
| taskID | uint256 | undefined |
| messageURI | string | undefined |
| isPrivate | bool | undefined |

### startTask

```solidity
function startTask(uint256 daoID, uint256 taskID) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID | uint256 | undefined |
| taskID | uint256 | undefined |

### taskStatus

```solidity
function taskStatus(uint256 daoID, uint256 taskID) external view returns (enum TrustX.TaskStatus)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID | uint256 | undefined |
| taskID | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | enum TrustX.TaskStatus | undefined |



## Events

### AssignerAssigned

```solidity
event AssignerAssigned(uint256 indexed daoID, uint256 indexed taskID, address assigner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID `indexed` | uint256 | undefined |
| taskID `indexed` | uint256 | undefined |
| assigner  | address | undefined |

### DAOCreated

```solidity
event DAOCreated(uint256 daoID, string name, string metadataURI, bool isPrivate, address createdBy)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID  | uint256 | undefined |
| name  | string | undefined |
| metadataURI  | string | undefined |
| isPrivate  | bool | undefined |
| createdBy  | address | undefined |

### DAOMembersAdded

```solidity
event DAOMembersAdded(uint256 indexed daoID, address[] members)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID `indexed` | uint256 | undefined |
| members  | address[] | undefined |

### Initialized

```solidity
event Initialized(uint8 version)
```



*Triggered when the contract has been initialized or reinitialized.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| version  | uint8 | undefined |

### Paused

```solidity
event Paused(address account)
```



*Emitted when the pause is triggered by `account`.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| account  | address | undefined |

### RequestedChanges

```solidity
event RequestedChanges(uint256 indexed daoID, uint256 indexed taskID, uint256 threadID, address requestedBy, string messageURI, bool isPrivate)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID `indexed` | uint256 | undefined |
| taskID `indexed` | uint256 | undefined |
| threadID  | uint256 | undefined |
| requestedBy  | address | undefined |
| messageURI  | string | undefined |
| isPrivate  | bool | undefined |

### ReviewRequested

```solidity
event ReviewRequested(uint256 indexed daoID, uint256 indexed taskID, uint256 threadID, address requestedBy, string messageURI, bool isPrivate)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID `indexed` | uint256 | undefined |
| taskID `indexed` | uint256 | undefined |
| threadID  | uint256 | undefined |
| requestedBy  | address | undefined |
| messageURI  | string | undefined |
| isPrivate  | bool | undefined |

### ReviewersAssigned

```solidity
event ReviewersAssigned(uint256 indexed daoID, uint256 indexed taskID, address[] reviewers)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID `indexed` | uint256 | undefined |
| taskID `indexed` | uint256 | undefined |
| reviewers  | address[] | undefined |

### TaskApproved

```solidity
event TaskApproved(uint256 indexed daoID, uint256 indexed taskID, uint256 threadID, address approvedBy, string messageURI, bool isPrivate, uint256[] scores)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID `indexed` | uint256 | undefined |
| taskID `indexed` | uint256 | undefined |
| threadID  | uint256 | undefined |
| approvedBy  | address | undefined |
| messageURI  | string | undefined |
| isPrivate  | bool | undefined |
| scores  | uint256[] | undefined |

### TaskCommented

```solidity
event TaskCommented(uint256 indexed daoID, uint256 indexed taskID, uint256 threadID, address createdBy, string messageURI, bool isPrivate)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID `indexed` | uint256 | undefined |
| taskID `indexed` | uint256 | undefined |
| threadID  | uint256 | undefined |
| createdBy  | address | undefined |
| messageURI  | string | undefined |
| isPrivate  | bool | undefined |

### TaskCompleted

```solidity
event TaskCompleted(uint256 indexed daoID, uint256 indexed taskID)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID `indexed` | uint256 | undefined |
| taskID `indexed` | uint256 | undefined |

### TaskCreated

```solidity
event TaskCreated(uint256 indexed daoID, uint256 taskID, enum TrustX.TaskStatus status, string name, string metadataURI, bool isPrivate, string[] skills, address createdBy)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID `indexed` | uint256 | undefined |
| taskID  | uint256 | undefined |
| status  | enum TrustX.TaskStatus | undefined |
| name  | string | undefined |
| metadataURI  | string | undefined |
| isPrivate  | bool | undefined |
| skills  | string[] | undefined |
| createdBy  | address | undefined |

### TaskStarted

```solidity
event TaskStarted(uint256 indexed daoID, uint256 indexed taskID)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID `indexed` | uint256 | undefined |
| taskID `indexed` | uint256 | undefined |

### Unpaused

```solidity
event Unpaused(address account)
```



*Emitted when the pause is lifted by `account`.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| account  | address | undefined |



