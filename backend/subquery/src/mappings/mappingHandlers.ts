import {
  Account,
  AccountSkill,
  Dao,
  DaoAccount,
  Notification,
  NotificationNonce,
  Skill,
  Task,
  TaskReviewer,
  TaskScore,
  TaskSkill,
  Thread,
} from "../types";
import { FrontierEvmEvent } from "@subql/frontier-evm-processor";
import { BigNumber, utils, constants } from "ethers";

const TASK_STATUSES = ["todo", "in_progress", "in_review", "done"] as const;

const THREAD_TYPES = [
  "comment",
  "review_request",
  "change_request",
  "approve",
] as const;

type DAOCreatedEventArgs = [BigNumber, string, string, boolean] & {
  daoID: BigNumber;
  name: string;
  metadataURI: string;
  isPrivate: boolean;
  createdBy: string;
};

export async function handleDAOCreated(
  event: FrontierEvmEvent<DAOCreatedEventArgs>
): Promise<void> {
  const dao = Dao.create({
    id: event.args.daoID.toHexString(),
    daoID: event.args.daoID.toBigInt(),
    name: event.args.name,
    metadataURI: event.args.metadataURI,
    isPrivate: event.args.isPrivate,
    numTasks: BigInt(0),
    createdBy: event.args.createdBy,
    createdTxHash: event.transactionHash,
    createdAt: BigInt(event.blockTimestamp.getTime()),
    createdBlockHeight: BigInt(event.blockNumber),
  });

  await dao.save();
}

type DAOMembersAddedEventArgs = [BigNumber, string[]] & {
  daoID: BigNumber;
  members: string[];
};

export async function handleDAOMembersAdded(
  event: FrontierEvmEvent<DAOMembersAddedEventArgs>
): Promise<void> {
  for (const member of event.args.members) {
    let account = await Account.get(member);
    if (account == undefined) {
      account = Account.create({
        id: member,
        address: member,
      });

      await account.save();
    }

    const daoAccountID = `${event.args.daoID.toHexString()}_${member}`;

    let daoAccount = await DaoAccount.get(daoAccountID);
    if (daoAccount == undefined) {
      daoAccount = DaoAccount.create({
        id: daoAccountID,
        daoId: event.args.daoID.toHexString(),
        accountId: member,
      });

      await daoAccount.save();
    }
  }
}

type TaskCreatedEventArgs = [
  BigNumber,
  BigNumber,
  BigNumber,
  string,
  string,
  boolean,
  string[],
  string
] & {
  daoID: BigNumber;
  taskID: BigNumber;
  status: number;
  name: string;
  metadataURI: string;
  isPrivate: boolean;
  skills: string[];
  createdBy: string;
};

export async function handleTaskCreated(
  event: FrontierEvmEvent<TaskCreatedEventArgs>
): Promise<void> {
  console.log(
    "debug event.args.status",
    event.args.status,
    typeof event.args.status
  );

  const task = await Task.create({
    id: `${event.args.daoID.toHexString()}_${event.args.taskID.toHexString()}`,
    daoID: event.args.daoID.toBigInt(),
    taskID: event.args.taskID.toBigInt(),
    status: TASK_STATUSES[event.args.status],
    name: event.args.name,
    metadataURI: event.args.metadataURI,
    isPrivate: event.args.isPrivate,
    assigner: constants.AddressZero,
    createdBy: event.args.createdBy,
    createdTxHash: event.transactionHash,
    createdAt: BigInt(event.blockTimestamp.getTime()),
    createdBlockHeight: BigInt(event.blockNumber),
  });

  await task.save();

  for (let i = 0; i < event.args.skills.length; i++) {
    const skillName = event.args.skills[i];

    const skillID = utils.keccak256(utils.toUtf8Bytes(skillName));
    let skill = await Skill.get(skillID);
    if (skill === undefined) {
      skill = await Skill.create({
        id: skillID,
        name: skillName,
      });

      await skill.save();
    }

    const taskSkillID = `${event.args.daoID.toHexString()}_${event.args.taskID.toHexString()}_0x${i.toString(
      16
    )}`;
    let taskSkill = await TaskSkill.get(taskSkillID);
    if (taskSkill === undefined) {
      taskSkill = TaskSkill.create({
        id: taskSkillID,
        index: BigInt(i),
        daoID: event.args.daoID.toBigInt(),
        taskID: event.args.taskID.toBigInt(),
        skillName: skillName,
        taskId: `${event.args.daoID.toHexString()}_${event.args.taskID.toHexString()}`,
        skillId: skill.id,
      });

      await taskSkill.save();
    }
  }

  const dao = await Dao.get(event.args.daoID.toHexString());
  if (dao !== undefined) {
    dao.numTasks = BigNumber.from(dao.numTasks)
      .add(BigNumber.from(1))
      .toBigInt();
  }
}

type AssignerAssignedEventArgs = [BigNumber, BigNumber, string] & {
  daoID: BigNumber;
  taskID: BigNumber;
  assigner: string;
};

export async function handleAssignerAssigned(
  event: FrontierEvmEvent<AssignerAssignedEventArgs>
): Promise<void> {
  const task = await Task.get(
    `${event.args.daoID.toHexString()}_${event.args.taskID.toHexString()}`
  );
  task.assigner = event.args.assigner;

  await task.save();

  await createNotification(
    event.args.daoID,
    event.args.assigner,
    "タスクがアサインされました",
    `タスク「${task.name}」の担当者として割り当てられました`,
    BigInt(event.blockTimestamp.getTime()),
    BigInt(event.blockNumber)
  );
}

type ReviewersAssignedEventArgs = [BigNumber, BigNumber, string[]] & {
  daoID: BigNumber;
  taskID: BigNumber;
  reviewers: string[];
};

export async function handleReviewersAssigned(
  event: FrontierEvmEvent<ReviewersAssignedEventArgs>
): Promise<void> {
  for (const reviewer of event.args.reviewers) {
    const taskReviewerID = `${event.args.daoID.toHexString()}_${event.args.taskID.toHexString()}_${reviewer}`;
    let taskReviewer = await TaskReviewer.get(taskReviewerID);
    if (taskReviewer === undefined) {
      taskReviewer = TaskReviewer.create({
        id: taskReviewerID,
        taskId: `${event.args.daoID.toHexString()}_${event.args.taskID.toHexString()}`,
        accountId: reviewer,
        approved: false,
      });

      await taskReviewer.save();
    }
  }
}

type TaskStartedEventArgs = [BigNumber, BigNumber] & {
  daoID: BigNumber;
  taskID: BigNumber;
};

export async function handleTaskStarted(
  event: FrontierEvmEvent<TaskStartedEventArgs>
): Promise<void> {
  const task = await Task.get(
    `${event.args.daoID.toHexString()}_${event.args.taskID.toHexString()}`
  );
  if (task !== undefined) {
    task.status = TASK_STATUSES[1];

    await task.save();
  }
}

type TaskCommentedEventArgs = [
  BigNumber,
  BigNumber,
  BigNumber,
  string,
  string,
  boolean
] & {
  daoID: BigNumber;
  taskID: BigNumber;
  threadID: BigNumber;
  createdBy: string;
  messageURI: string;
  isPrivate: boolean;
};

export async function handleTaskCommented(
  event: FrontierEvmEvent<TaskCommentedEventArgs>
): Promise<void> {
  await createThread(
    event.args.daoID,
    event.args.taskID,
    event.args.threadID,
    THREAD_TYPES[0],
    event.args.messageURI,
    event.args.isPrivate,
    event.args.createdBy,
    event.transactionHash,
    BigInt(event.blockTimestamp.getTime()),
    BigInt(event.blockNumber)
  );
}

type ReviewRequestedEventArgs = [
  BigNumber,
  BigNumber,
  BigNumber,
  string,
  string,
  boolean
] & {
  daoID: BigNumber;
  taskID: BigNumber;
  threadID: BigNumber;
  requestedBy: string;
  messageURI: string;
  isPrivate: boolean;
};

export async function handleReviewRequested(
  event: FrontierEvmEvent<ReviewRequestedEventArgs>
): Promise<void> {
  const task = await Task.get(
    `${event.args.daoID.toHexString()}_${event.args.taskID.toHexString()}`
  );
  if (task !== undefined) {
    task.status = TASK_STATUSES[2];
    await task.save();
  }

  await createThread(
    event.args.daoID,
    event.args.taskID,
    event.args.threadID,
    THREAD_TYPES[1],
    event.args.messageURI,
    event.args.isPrivate,
    event.args.requestedBy,
    event.transactionHash,
    BigInt(event.blockTimestamp.getTime()),
    BigInt(event.blockNumber)
  );

  const reviewers = await TaskReviewer.getByTaskId(
    `${event.args.daoID.toHexString()}_${event.args.taskID.toHexString()}`
  );

  await Promise.all(
    reviewers.map(async (reviewer) => {
      const account = await Account.get(reviewer.accountId);
      if (!account) {
        return null;
      }

      await createNotification(
        event.args.daoID,
        account.address,
        "タスクのレビューがリクエストされました",
        `タスク「${task.name}」のレビューを依頼されました`,
        BigInt(event.blockTimestamp.getTime()),
        BigInt(event.blockNumber)
      );
    })
  );
}

type RequestedChangesEventArgs = [
  BigNumber,
  BigNumber,
  BigNumber,
  string,
  string,
  boolean
] & {
  daoID: BigNumber;
  taskID: BigNumber;
  threadID: BigNumber;
  requestedBy: string;
  messageURI: string;
  isPrivate: boolean;
};

export async function handleRequestedChanges(
  event: FrontierEvmEvent<RequestedChangesEventArgs>
): Promise<void> {
  const task = await Task.get(
    `${event.args.daoID.toHexString()}_${event.args.taskID.toHexString()}`
  );
  if (task !== undefined) {
    task.status = TASK_STATUSES[1];
    await task.save();
  }

  const taskReviewerID = `${event.args.daoID.toHexString()}_${event.args.taskID.toHexString()}_${
    event.args.requestedBy
  }`;
  const taskReviewer = await TaskReviewer.get(taskReviewerID);
  if (taskReviewer !== undefined) {
    taskReviewer.approved = false;

    await taskReviewer.save();
  }

  await createThread(
    event.args.daoID,
    event.args.taskID,
    event.args.threadID,
    THREAD_TYPES[2],
    event.args.messageURI,
    event.args.isPrivate,
    event.args.requestedBy,
    event.transactionHash,
    BigInt(event.blockTimestamp.getTime()),
    BigInt(event.blockNumber)
  );

  await createNotification(
    event.args.daoID,
    task.assigner,
    "タスクの修正依頼がリクエストされました",
    `タスク「${task.name}」の修正の依頼をされました`,
    BigInt(event.blockTimestamp.getTime()),
    BigInt(event.blockNumber)
  );
}

type TaskApprovedEventArgs = [
  BigNumber,
  BigNumber,
  BigNumber,
  string,
  string,
  boolean,
  BigNumber[]
] & {
  daoID: BigNumber;
  taskID: BigNumber;
  threadID: BigNumber;
  approvedBy: string;
  messageURI: string;
  isPrivate: boolean;
  scores: BigNumber[];
};

export async function handleTaskApproved(
  event: FrontierEvmEvent<TaskApprovedEventArgs>
): Promise<void> {
  const taskReviewerID = `${event.args.daoID.toHexString()}_${event.args.taskID.toHexString()}_${
    event.args.approvedBy
  }`;
  const taskReviewer = await TaskReviewer.get(taskReviewerID);
  if (taskReviewer !== undefined) {
    taskReviewer.approved = true;

    await taskReviewer.save();
  }

  for (let i = 0; i < event.args.scores.length; i++) {
    const score = event.args.scores[i];

    const taskSkillID = `${event.args.daoID.toHexString()}_${event.args.taskID.toHexString()}_0x${i.toString(
      16
    )}`;
    const taskSkill = await TaskSkill.get(taskSkillID);
    if (taskSkill !== undefined) {
      const taskScore = TaskScore.create({
        id: `${event.args.daoID.toHexString()}_${event.args.taskID.toHexString()}_${
          event.args.approvedBy
        }_0x${i.toString(16)}`,
        score: score.toBigInt(),
        taskId: `${event.args.daoID.toHexString()}_${event.args.taskID.toHexString()}`,
        taskSkillId: taskSkillID,
      });

      await taskScore.save();
    }
  }

  const task = await Task.get(
    `${event.args.daoID.toHexString()}_${event.args.taskID.toHexString()}`
  );
  if (task) {
    let taskSkills = await TaskSkill.getByTaskId(
      `${event.args.daoID.toHexString()}_${event.args.taskID.toHexString()}`
    );
    taskSkills = (taskSkills ?? [])
      .slice()
      .sort(
        (a, b) =>
          BigNumber.from(a.index).toNumber() -
          BigNumber.from(b.index).toNumber()
      );

    await Promise.all(
      taskSkills.map(async (taskSkill) => {
        const accountSkillID = `${task.assigner}_${taskSkill.skillId}`;
        let accountSkill = await AccountSkill.get(accountSkillID);
        if (!accountSkill) {
          accountSkill = AccountSkill.create({
            id: accountSkillID,
            address: task.assigner,
            skillID: taskSkill.skillId,
            skillId: taskSkill.skillId,
            score: BigNumber.from(0).toBigInt(),
          });
        }

        accountSkill.score = BigNumber.from(accountSkill.score)
          .add(event.args.scores[BigNumber.from(taskSkill.index).toNumber()])
          .toBigInt();
        await accountSkill.save();
      })
    );
  }

  await createThread(
    event.args.daoID,
    event.args.taskID,
    event.args.threadID,
    THREAD_TYPES[3],
    event.args.messageURI,
    event.args.isPrivate,
    event.args.approvedBy,
    event.transactionHash,
    BigInt(event.blockTimestamp.getTime()),
    BigInt(event.blockNumber)
  );
}

type TaskCompletedEventArgs = [BigNumber, BigNumber] & {
  daoID: BigNumber;
  taskID: BigNumber;
};

export async function handleTaskCompleted(
  event: FrontierEvmEvent<TaskCompletedEventArgs>
): Promise<void> {
  const task = await Task.get(
    `${event.args.daoID.toHexString()}_${event.args.taskID.toHexString()}`
  );
  if (task !== undefined) {
    task.status = TASK_STATUSES[3];
    await task.save();
  }

  await createNotification(
    event.args.daoID,
    task.assigner,
    "タスクが完了しました",
    `タスク「${task.name}」は全てのレビュワーの承認を得たため、完了しました`,
    BigInt(event.blockTimestamp.getTime()),
    BigInt(event.blockNumber)
  );
}

async function createThread(
  daoID: BigNumber,
  taskID: BigNumber,
  threadID: BigNumber,
  threadType: string,
  messageURI: string,
  isPrivate: boolean,
  createdBy: string,
  createdTxHash: string,
  createdAt: bigint,
  createdBlockHeight: bigint
) {
  const thread = Thread.create({
    id: `${daoID.toHexString()}_${taskID.toHexString()}_${threadID.toHexString()}`,
    daoID: daoID.toBigInt(),
    taskID: taskID.toBigInt(),
    threadID: threadID.toBigInt(),
    threadType: threadType,
    messageURI: messageURI.length > 0 ? messageURI : null,
    isPrivate: messageURI.length > 0 ? isPrivate : null,
    createdBy: createdBy,
    createdTxHash: createdTxHash,
    createdAt: createdAt,
    createdBlockHeight: createdBlockHeight,
    taskId: `${daoID.toHexString()}_${taskID.toHexString()}`,
  });

  await thread.save();
}

async function createNotification(
  daoID: BigNumber,
  to: string,
  title: string,
  message: string,
  createdAt: bigint,
  createdBlockHeight: bigint
) {
  let notificationNonce = await NotificationNonce.get(
    `${daoID.toHexString()}_${to}`
  );
  if (!notificationNonce) {
    notificationNonce = NotificationNonce.create({
      id: `${daoID.toHexString()}_${to}`,
      nonce: BigInt(0),
    });
  }

  const notification = Notification.create({
    id: `${daoID.toHexString()}_${to}_${BigNumber.from(
      notificationNonce.nonce
    )}`,
    daoID: daoID.toBigInt(),
    to: to,
    nonce: notificationNonce.nonce,
    title: title,
    message: message,
    createdAt: createdAt,
    createdBlockHeight: createdBlockHeight,
  });

  await notification.save();

  notificationNonce.nonce = BigNumber.from(notificationNonce.nonce)
    .add(BigNumber.from(1))
    .toBigInt();
  await notificationNonce.save();
}
