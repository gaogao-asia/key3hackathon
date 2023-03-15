# TrustX









## Methods

### addMembers

```solidity
function addMembers(uint256 daoID, address[] newMembers) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID | uint256 | undefined |
| newMembers | address[] | undefined |

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

### initialize

```solidity
function initialize() external nonpayable
```






### paused

```solidity
function paused() external view returns (bool)
```



*Returns true if the contract is paused, and false otherwise.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |



## Events

### DAOCreated

```solidity
event DAOCreated(uint256 daoID, string name, string metadataURI, bool isPrivate)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| daoID  | uint256 | undefined |
| name  | string | undefined |
| metadataURI  | string | undefined |
| isPrivate  | bool | undefined |

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

### Unpaused

```solidity
event Unpaused(address account)
```



*Emitted when the pause is lifted by `account`.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| account  | address | undefined |



