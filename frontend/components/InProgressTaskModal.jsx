// (レビュー依頼ボタンがある)
// In Progressのタスクをクリックすると開く。

import React from "react";
import { useEffect } from "react";
import { Modal, Form, Input, Select, Tag, Button, Divider } from "antd";
import { SkillTagOptions } from "../consts/skills";
import { useTask } from "../hooks/task";
import { useDAOContext } from "../contexts/dao_context";
import { AccountsMap } from "../consts/accounts";
import { downloadFromIPFS, uploadToIPFS } from "../clients/ipfs";
import {
  UploadingAndSendingTx,
  WAITING_STEP_CONFIRMING,
  WAITING_STEP_SIGNING,
  WAITING_STEP_UPLOADING,
} from "./UploadingAndSendingTx";
import { TxResult } from "./TxResult";
import { ethers } from "ethers";
import { TRUST_X_CONTRACT_SHIBUYA } from "../consts/contracts";
import { TRUST_X_ABI } from "../consts/abis";
import { useAccount, useSigner } from "wagmi";
import { useState } from "react";

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

const InputForm = (props) => {
  const { form, memberList, onFinish } = props;

  const { address } = useAccount();
  const assigner = Form.useWatch("assigner", form);

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item label="タスク名" name="title">
        <Input readOnly />
      </Form.Item>
      <Form.Item label="概要" name="description">
        <Input.TextArea rows={2} readOnly />
      </Form.Item>
      <Form.Item label="担当者" name="assigner">
        <Select
          placeholder="担当者を選択"
          options={memberList}
          open={false}
          style={{ pointerEvents: "none" }}
        />
      </Form.Item>
      <Form.Item label="承認担当者" name="reviewers">
        <Select
          mode="multiple"
          placeholder="承認担当者を選択"
          options={memberList}
          open={false}
          style={{ pointerEvents: "none" }}
        />
      </Form.Item>
      <Form.Item label="スキル" name="skills">
        <Select
          mode="multiple"
          placeholder="スキルを選択"
          options={SkillTagOptions}
          tagRender={tagRender}
          open={false}
          style={{ pointerEvents: "none" }}
        />
      </Form.Item>
      {address === assigner && [
        <Divider />,
        <Form.Item
          label="成果物"
          name="artifact"
          rules={[{ required: true, message: "Please enter the artifact" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>,
      ]}
      <div class="flex justify-end items-center">
        <Button
          type="primary"
          htmlType="submit"
          disabled={address !== assigner}
        >
          {address === assigner
            ? "レビューを依頼する"
            : "担当者のみがレビュー依頼できます"}
        </Button>
      </div>
    </Form>
  );
};

const VIEW_FORM = 0;
const VIEW_WAITING = 1;
const VIEW_RESULT = 2;

const InProgressTaskModal = ({
  taskPrimaryID,
  visible,
  onReviewRequested,
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

  console.log("taskPrimaryID", taskPrimaryID);

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

      console.log("loaded", {
        title: taskQuery.data.task.name,
        description: metadata.description,
        assigner: taskQuery.data.task.assigner,
        reviewers: taskQuery.data.task.reviewers,
        skills: taskQuery.data.task.skills
          .map((s) => {
            const skillItem = SkillTagOptions.find((x) => x.label === s.name);

            return skillItem?.value ?? null;
          })
          .filter(Boolean),
      });

      form.setFieldsValue({
        title: taskQuery.data.task.name,
        description: metadata.description,
        assigner: taskQuery.data.task.assigner,
        reviewers: taskQuery.data.task.reviewers,
        skills: taskQuery.data.task.skills
          .map((s) => {
            const skillItem = SkillTagOptions.find((x) => x.label === s.name);

            return skillItem?.value ?? null;
          })
          .filter(Boolean),
        artifact: "",
      });
    })();
  }, [taskQuery.data]);

  // 結果データ
  const [view, setView] = useState(VIEW_FORM);
  const [waitingStep, setWaitingStep] = useState(WAITING_STEP_UPLOADING);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cid, setCID] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [blockHeight, setBlockHeight] = useState(null);
  const [txCost, setTxCost] = useState(null);

  const { data: signer } = useSigner();
  const daoData = useDAOContext();

  const onFinish = (values) => {
    setWaitingStep(WAITING_STEP_UPLOADING);
    setView(VIEW_WAITING);

    const contract = new ethers.Contract(
      TRUST_X_CONTRACT_SHIBUYA,
      TRUST_X_ABI,
      signer
    );

    const daoID = ethers.BigNumber.from(daoData?.dao?.daoID);

    (async () => {
      try {
        const cid = await uploadToIPFS({
          description: values.artifact,
        });

        setCID(cid);
        setWaitingStep(WAITING_STEP_SIGNING);

        const tx = await contract.requestTaskReview(
          // DAO ID
          daoID,
          // Task ID
          taskQuery?.data?.task?.taskID,
          // messageURI
          `ipfs://${cid}`,
          // isPrivate
          false
        );

        console.log("debug::tx", tx);

        setTxHash(tx.hash);

        setWaitingStep(WAITING_STEP_CONFIRMING);

        const receipt = await tx.wait();

        console.log("debug::receipt", receipt);

        setTxCost(
          ethers.utils.formatEther(
            receipt.gasUsed.mul(receipt.effectiveGasPrice)
          )
        );
        setBlockHeight(receipt.blockNumber);

        onReviewRequested && onReviewRequested(taskPrimaryID);

        setIsSuccess(true);
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
    setView(VIEW_FORM);
    setWaitingStep(WAITING_STEP_UPLOADING);
    onCancel();

    setIsSuccess(false);
    setCID(null);
    setTxHash(null);
    setBlockHeight(null);
    setTxCost(null);
  };

  const Views = [
    <InputForm form={form} onFinish={onFinish} memberList={memberList} />,
    <UploadingAndSendingTx
      current={waitingStep}
      cid={cid}
      txHash={txHash}
      descriptionForFutureTx={"レビュー依頼をします"}
      descriptionForOngoingTx={
        "スマートコントラクトを呼び出し、レビュー依頼を送信しています..."
      }
    />,
    <TxResult
      isSuccess={isSuccess}
      txHash={txHash}
      blockHeight={blockHeight}
      txCost={txCost}
      successMessage={"レビュー依頼をしました"}
      errorMessage={"レビュー依頼に失敗しました"}
    />,
  ];

  const Titles = ["作業中タスク", "", ""];

  return (
    <Modal
      title={Titles[view]}
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

export default InProgressTaskModal;
