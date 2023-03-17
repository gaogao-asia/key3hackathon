// (タスク開始ボタンがある)
// 未着手のタスクをクリックすると開く。

import React, { useState } from "react";
import { useEffect } from "react";
import { Modal, Form, Input, Select, Tag, Button } from "antd";
import { Skills } from "../consts/skills";
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

const tagRender = (props) => {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      color={value.slice(-7)}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
};

const ViewTask = (props) => {
  const { form, memberList, onSubmit } = props;
  const { address } = useAccount();
  const assigner = Form.useWatch("assigner", form);

  return (
    <Form form={form} layout="vertical">
      <Form.Item label="タスク名" name="title">
        <Input readOnly />
      </Form.Item>
      <Form.Item label="概要" name="description">
        <Input.TextArea rows={4} readOnly />
      </Form.Item>
      <Form.Item label="担当者" name="assigner">
        <Select
          open={false}
          style={{ pointerEvents: "none" }}
          placeholder="担当者を選択"
          options={memberList}
        />
      </Form.Item>
      <Form.Item label="承認担当者" name="reviewers">
        <Select
          open={false}
          style={{ pointerEvents: "none" }}
          mode="multiple"
          placeholder="承認担当者を選択"
          options={memberList}
        />
      </Form.Item>
      <Form.Item label="スキル" name="skills">
        <Select
          open={false}
          style={{ pointerEvents: "none" }}
          mode="multiple"
          placeholder="スキルを選択"
          options={skillTagOptions}
          tagRender={tagRender}
        />
      </Form.Item>
      <div class="flex justify-end items-center">
        <Button
          type="primary"
          htmlType="submit"
          disabled={address !== assigner}
          onClick={onSubmit}
        >
          {address === assigner ? "タスク開始" : "担当者のみが開始できます"}
        </Button>
      </div>
    </Form>
  );
};

const skillTagOptions = Skills.map((skill) => ({
  label: skill.name,
  value: skill.name + skill.color,
}));

const VIEW_TASK = 0;
const VIEW_WAITING = 1;
const VIEW_RESULT = 2;

const AssignedToDoTaskModal = ({
  taskPrimaryID,
  visible,
  onTaskStarted,
  onCancel,
}) => {
  const [form] = Form.useForm();

  const dao = useDAOContext();
  const memberList = (dao?.members ?? []).map((m) => {
    return {
      label: AccountsMap[m].fullname,
      value: m,
    };
  });

  const taskQuery = useTask(taskPrimaryID);

  useEffect(() => {
    if (!taskQuery.data) {
      form.resetFields();

      return;
    }

    (async () => {
      const metadataCID = taskQuery.data.task.metadataURI.replace(
        "ipfs://",
        ""
      );
      const metadata = JSON.parse(await downloadFromIPFS(metadataCID));

      form.setFieldsValue({
        title: taskQuery.data.task.name,
        description: metadata.description,
        assigner: taskQuery.data.task.assigner,
        reviewers: taskQuery.data.task.reviewers,
        skills: taskQuery.data.task.skills
          .map((s) => {
            const skillItem = skillTagOptions.find((x) => x.label === s.name);

            return skillItem?.value ?? null;
          })
          .filter(Boolean),
      });
    })();
  }, [taskQuery.data]);

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
    form.resetFields();

    setView(VIEW_TASK);
    setSendingTxStep(WAITING_STEP_SIGNING);
    setIsSuccess(false);
    setTxHash(null);
    setBlockHeight(null);
    setTxCost(null);

    onCancel();
  };

  const Views = [
    <ViewTask
      form={form}
      memberList={memberList}
      onSubmit={handleStartPressed}
    />,
    <SendingTxView
      current={sendingTxStep}
      txHash={txHash}
      descriptionForFutureTx={"タスクのステータスを更新します"}
      descriptionForOngoingTx={
        "スマートコントラクトを呼び出し、タスクのステータスを更新しています..."
      }
    />,
    <TxResult
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
      title="未着手タスク"
      open={visible}
      onCancel={handleCancel}
      footer={false}
      destroyOnClose
      width="800px"
    >
      {Views[view]}
    </Modal>
  );
};

export default AssignedToDoTaskModal;
