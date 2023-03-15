# Lock









## Methods

### initialize

```solidity
function initialize(uint256 _unlockTime) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _unlockTime | uint256 | undefined |

### owner

```solidity
function owner() external view returns (address payable)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address payable | undefined |

### unlockTime

```solidity
function unlockTime() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### withdraw

```solidity
function withdraw() external nonpayable
```








## Events

### Initialized

```solidity
event Initialized(uint8 version)
```



*Triggered when the contract has been initialized or reinitialized.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| version  | uint8 | undefined |

### Withdrawal

```solidity
event Withdrawal(uint256 amount, uint256 when)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| amount  | uint256 | undefined |
| when  | uint256 | undefined |



