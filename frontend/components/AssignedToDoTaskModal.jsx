// (タスク開始ボタンがある)
// 未着手のタスクをクリックすると開く。

import React, { useState } from "react";
import { useEffect } from "react";
import { Modal, Form, Input, Select, Tag, Button } from "antd";
import { Skills, SkillTagOptions } from "../consts/skills";
import { useTask } from "../hooks/task";
import { AccountsMap } from "../consts/accounts";
import { useDAOContext } from "../contexts/dao_context";
import { downloadFromIPFS } from "../clients/ipfs";
import { useAccount, useSigner } from "wagmi";
import {
  SendingTxView,
  WAITING_STEP_CONFIRMING,
  WAITING_STEP_SIGNING,
} from "./SendingTx";
import { ethers } from "ethers";
import { TRUST_X_CONTRACT_SHIBUYA } from "../consts/contracts";
import { TRUST_X_ABI } from "../consts/abis";
import { TxResult } from "./TxResult";
import { TaskOverview } from "./TaskOverview";

const ViewTask = (props) => {
  const { taskID, assigner, onSubmit } = props;
  const { address } = useAccount();

  return (
    <div>
      <TaskOverview taskID={taskID} />
      {assigner === address && (
        <div class="flex justify-end items-center">
          <Button
            type="primary"
            htmlType="submit"
            disabled={address !== assigner}
            onClick={onSubmit}
          >
            タスク開始
          </Button>
        </div>
      )}
    </div>
  );
};

const VIEW_TASK = 0;
const VIEW_WAITING = 1;
const VIEW_RESULT = 2;

const AssignedToDoTaskModal = ({
  taskPrimaryID,
  visible,
  onTaskStarted,
  onCancel,
}) => {
  const taskQuery = useTask(taskPrimaryID);

  const { data: signer } = useSigner();
  const [view, setView] = useState(VIEW_TASK);
  const [sendingTxStep, setSendingTxStep] = useState(WAITING_STEP_SIGNING);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [blockHeight, setBlockHeight] = useState(null);
  const [txCost, setTxCost] = useState(null);

  const handleStartPressed = () => {
    setView(VIEW_WAITING);

    const contract = new ethers.Contract(
      TRUST_X_CONTRACT_SHIBUYA,
      TRUST_X_ABI,
      signer
    );

    (async () => {
      try {
        const tx = await contract.startTask(
          Number.parseInt(taskQuery.data.task.daoID),
          Number.parseInt(taskQuery.data.task.taskID)
        );

        setTxHash(tx.hash);

        setSendingTxStep(WAITING_STEP_CONFIRMING);

        const receipt = await tx.wait();

        setTxCost(
          ethers.utils.formatEther(
            receipt.gasUsed.mul(receipt.effectiveGasPrice)
          )
        );
        setBlockHeight(receipt.blockNumber);
        //
        setIsSuccess(true);
        onTaskStarted && onTaskStarted(taskPrimaryID);
      } catch (error) {
        console.error(error);
        setIsSuccess(false);
      } finally {
        setView(VIEW_RESULT);
      }
    })();
  };

  const handleCancel = () => {
    setView(VIEW_TASK);
    setSendingTxStep(WAITING_STEP_SIGNING);
    setIsSuccess(false);
    setTxHash(null);
    setBlockHeight(null);
    setTxCost(null);

    onCancel(taskPrimaryID, isSuccess);
  };

  const Views = [
    <ViewTask
      key={0}
      assigner={taskQuery.data?.task?.assigner ?? null}
      taskID={taskPrimaryID}
      onSubmit={handleStartPressed}
    />,
    <SendingTxView
      key={1}
      current={sendingTxStep}
      txHash={txHash}
      descriptionForFutureTx={"タスクのステータスを更新します"}
      descriptionForOngoingTx={
        "スマートコントラクトを呼び出し、タスクのステータスを更新しています..."
      }
    />,
    <TxResult
      key={2}
      isSuccess={isSuccess}
      txHash={txHash}
      blockHeight={blockHeight}
      txCost={txCost}
      successMessage={"タスクを開始しました"}
      errorMessage={"タスクの開始に失敗しました"}
    />,
  ];

  return (
    <Modal
      title={taskQuery?.data?.task?.name}
      open={visible}
      onCancel={handleCancel}
      footer={false}
      destroyOnClose
      width="1000px"
      bodyStyle={{ margin: "24px 0px" }}
    >
      {Views[view]}
    </Modal>
  );
};

export default AssignedToDoTaskModal;
