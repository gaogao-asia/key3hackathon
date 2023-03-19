export const TRUST_X_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "daoID",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "taskID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "assigner",
        type: "address",
      },
    ],
    name: "AssignerAssigned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "daoID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "metadataURI",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isPrivate",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "address",
        name: "createdBy",
        type: "address",
      },
    ],
    name: "DAOCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "daoID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "members",
        type: "address[]",
      },
    ],
    name: "DAOMembersAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "daoID",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "taskID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "threadID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "requestedBy",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "messageURI",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isPrivate",
        type: "bool",
      },
    ],
    name: "RequestedChanges",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "daoID",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "taskID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "threadID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "requestedBy",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "messageURI",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isPrivate",
        type: "bool",
      },
    ],
    name: "ReviewRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "daoID",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "taskID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "reviewers",
        type: "address[]",
      },
    ],
    name: "ReviewersAssigned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "daoID",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "taskID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "threadID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "approvedBy",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "messageURI",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isPrivate",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "scores",
        type: "uint256[]",
      },
    ],
    name: "TaskApproved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "daoID",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "taskID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "threadID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "createdBy",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "messageURI",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isPrivate",
        type: "bool",
      },
    ],
    name: "TaskCommented",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "daoID",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "taskID",
        type: "uint256",
      },
    ],
    name: "TaskCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "daoID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "taskID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum TrustX.TaskStatus",
        name: "status",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "metadataURI",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isPrivate",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "string[]",
        name: "skills",
        type: "string[]",
      },
      {
        indexed: false,
        internalType: "address",
        name: "createdBy",
        type: "address",
      },
    ],
    name: "TaskCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "daoID",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "taskID",
        type: "uint256",
      },
    ],
    name: "TaskStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "daoID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "taskID",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "messageURI",
        type: "string",
      },
      {
        internalType: "bool",
        name: "isPrivate",
        type: "bool",
      },
    ],
    name: "addComment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "daoID",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "newMembers",
        type: "address[]",
      },
    ],
    name: "addMembers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "daoID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "taskID",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "messageURI",
        type: "string",
      },
      {
        internalType: "bool",
        name: "isPrivate",
        type: "bool",
      },
      {
        internalType: "uint256[]",
        name: "scores",
        type: "uint256[]",
      },
    ],
    name: "approveTask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "daoID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "taskID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "assigner",
        type: "address",
      },
    ],
    name: "assignAssigner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "daoID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "taskID",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "reviewers",
        type: "address[]",
      },
    ],
    name: "assignReviewers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "daoID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "canViewDAO",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "daoID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "taskID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "canViewTask",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "metadataURI",
        type: "string",
      },
      {
        internalType: "bool",
        name: "isPrivate",
        type: "bool",
      },
      {
        internalType: "address[]",
        name: "members",
        type: "address[]",
      },
    ],
    name: "createDAO",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "daoID",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "metadataURI",
        type: "string",
      },
      {
        internalType: "bool",
        name: "isPrivate",
        type: "bool",
      },
      {
        internalType: "enum TrustX.TaskStatus",
        name: "taskStatus",
        type: "uint8",
      },
      {
        internalType: "string[]",
        name: "skills",
        type: "string[]",
      },
      {
        internalType: "address",
        name: "assigner",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "reviewers",
        type: "address[]",
      },
    ],
    name: "createTask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "numberOfDAOs",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "daoID",
        type: "uint256",
      },
    ],
    name: "numberOfTasks",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "daoID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "taskID",
        type: "uint256",
      },
    ],
    name: "numberOfThreads",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "daoID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "taskID",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "messageURI",
        type: "string",
      },
      {
        internalType: "bool",
        name: "isPrivate",
        type: "bool",
      },
    ],
    name: "requestChanges",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "daoID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "taskID",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "messageURI",
        type: "string",
      },
      {
        internalType: "bool",
        name: "isPrivate",
        type: "bool",
      },
    ],
    name: "requestTaskReview",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "daoID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "taskID",
        type: "uint256",
      },
    ],
    name: "startTask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "daoID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "taskID",
        type: "uint256",
      },
    ],
    name: "taskStatus",
    outputs: [
      {
        internalType: "enum TrustX.TaskStatus",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
