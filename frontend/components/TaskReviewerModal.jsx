// (承認ボタン、修正依頼ボタン、コメント用フォームがある)
// レビュー中の一番上とかのタスクをクリックすると開く。
// (これは別タブで開くか)

import React, { useMemo } from "react";
import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Button,
  Divider,
  Row,
  Col,
  Slider,
  Typography,
} from "antd";
import { SkillTagOptions } from "../consts/skills";
import { useDAOContext } from "../contexts/dao_context";
import { useAccount, useSigner } from "wagmi";
import { useTask } from "../hooks/task";
import { downloadFromIPFS, uploadToIPFS } from "../clients/ipfs";
import { AccountsMap } from "../consts/accounts";
import { useTaskThread } from "../hooks/task_threads";
import {
  UploadingAndSendingTx,
  WAITING_STEP_CONFIRMING,
  WAITING_STEP_SIGNING,
  WAITING_STEP_UPLOADING,
} from "./UploadingAndSendingTx";
import { TxResult } from "./TxResult";
import { TRUST_X_CONTRACT_SHIBUYA } from "../consts/contracts";
import { TRUST_X_ABI } from "../consts/abis";
import { ethers } from "ethers";

const { Text, Link } = Typography;

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

const ReviewForm = (props) => {
  const { form, memberList, skills = [], onReject, onApprove } = props;
  const { address } = useAccount();
  const reviewers = Form.useWatch("reviewers", form);
  const comment = Form.useWatch("review_comment", form);

  const isReviewer = useMemo(
    () => (reviewers ?? []).find((r) => r === address) !== undefined
  );

  console.log("skills", skills);

  return (
    <Form form={form} layout="vertical">
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
      <Form.Item label="成果物" name="artifact">
        <Input.TextArea rows={2} readOnly />
      </Form.Item>
      {/* ToDo: UIをカイゼンする */}
      <Divider />
      <Typography style={{ fontWeight: "bold" }}>タスクの評価</Typography>
      <Form.Item
        label="コメント"
        name="review_comment"
        rules={[{ required: false, message: "Please enter your comment" }]}
        style={{ marginTop: "8px" }}
      >
        <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
      </Form.Item>
      <div>
        <Typography>スキル評価 (5段階)</Typography>
        <div
          className="flex flex-col justify-center align-center"
          style={{ margin: "24px 60px 0px" }}
        >
          {skills.map((skill, index) => {
            return (
              <Form.Item
                label={skill}
                name={`skill_points[${index}]`}
                style={{ display: "inline-block" }}
              >
                <Slider min={1} max={5} />
              </Form.Item>
            );
          })}
        </div>
      </div>

      <div class="flex justify-end items-center">
        <Button
          type="primary"
          danger
          htmlType="submit"
          className="mr-3"
          disabled={!isReviewer}
          onClick={() => onReject(comment)}
        >
          {isReviewer ? "修正を依頼する" : "レビュワーのみ修正依頼ができます"}
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          disabled={!isReviewer}
          onClick={() => {
            const skillPoints = skills.map((_s, index) => {
              return form.getFieldValue(`skill_points[${index}]`);
            });

            onApprove(comment, skillPoints);
          }}
        >
          {isReviewer
            ? "タスクを承認する"
            : "レビュワーのみがタスクを承認できます"}
        </Button>
      </div>
    </Form>
  );
};

const VIEW_FORM = 0;
const VIEW_WAITING = 1;
const VIEW_RESULT = 2;

const TaskReviewerModal = ({
  taskPrimaryID,
  visible,
  onCancel,
  onChangeRequested,
  onCompleted,
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
  const taskThreadQuery = useTaskThread(
    dao?.dao?.daoID,
    taskQuery?.data?.task?.taskID
  );

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
            const skillItem = SkillTagOptions.find((x) => x.label === s.name);

            return skillItem?.value ?? null;
          })
          .filter(Boolean),
        artifact: "",
      });
    })();
  }, [taskQuery.data]);

  useEffect(() => {
    if (!taskThreadQuery?.data) {
      form.setFieldsValue({
        artifact: "",
      });

      return;
    }

    const latestRequestReview = (taskThreadQuery?.data?.threads ?? []).findLast(
      (t) => t.threadType === "review_request"
    );

    console.log(
      "latestRequestReview",
      taskThreadQuery?.data,
      latestRequestReview
    );

    if (latestRequestReview === undefined) {
      return;
    }

    (async () => {
      const metadataCID = latestRequestReview.messageURI.replace("ipfs://", "");
      const metadata = JSON.parse(await downloadFromIPFS(metadataCID));

      form.setFieldsValue({
        artifact: metadata.description,
      });
    })();
  }, [taskThreadQuery?.data]);

  const [view, setView] = useState(VIEW_FORM);
  const [waitingStep, setWaitingStep] = useState(WAITING_STEP_UPLOADING);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cid, setCID] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [blockHeight, setBlockHeight] = useState(null);
  const [txCost, setTxCost] = useState(null);

  const [descriptionsForTx, setDescriptionsForTx] = useState([]);
  const [resultMessages, setResultMessages] = useState([]);

  const { data: signer } = useSigner();
  const handleReject = (message) => {
    setDescriptionsForTx([
      "修正依頼をします",
      "スマートコントラクトを呼び出し、修正依頼を送信しています...",
    ]);
    setResultMessages(["修正依頼に失敗しました", "修正依頼をしました"]);

    setWaitingStep(WAITING_STEP_UPLOADING);
    setView(VIEW_WAITING);

    const contract = new ethers.Contract(
      TRUST_X_CONTRACT_SHIBUYA,
      TRUST_X_ABI,
      signer
    );

    const daoID = Number.parseInt(taskQuery?.data?.task?.daoID);
    const taskID = Number.parseInt(taskQuery?.data?.task?.taskID);

    console.log("daoID", daoID, "taskID", taskID);

    (async () => {
      try {
        const cid = await uploadToIPFS({
          description: message,
        });

        setCID(cid);
        setWaitingStep(WAITING_STEP_SIGNING);

        const tx = await contract.requestChanges(
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

        onChangeRequested && onChangeRequested(taskPrimaryID);

        setIsSuccess(true);
      } catch (error) {
        console.error(error);
        setIsSuccess(false);
      } finally {
        setView(VIEW_RESULT);
      }
    })();
  };

  const handleApprove = (message, skillScores) => {
    console.log("handleApprove", message, skillScores);

    setDescriptionsForTx([
      "タスクを承認します",
      "スマートコントラクトを呼び出し、タスクの承認を送信しています...",
    ]);
    setResultMessages(["タスクの承認に失敗しました", "タスクの承認をしました"]);

    setWaitingStep(WAITING_STEP_UPLOADING);
    setView(VIEW_WAITING);

    const contract = new ethers.Contract(
      TRUST_X_CONTRACT_SHIBUYA,
      TRUST_X_ABI,
      signer
    );

    const daoID = Number.parseInt(taskQuery?.data?.task?.daoID);

    (async () => {
      try {
        const cid = await uploadToIPFS({
          description: message ?? "",
        });

        setCID(cid);
        setWaitingStep(WAITING_STEP_SIGNING);

        const tx = await contract.approveTask(
          // DAO ID
          daoID,
          // Task ID
          taskQuery?.data?.task?.taskID,
          // messageURI
          `ipfs://${cid}`,
          // isPrivate
          false,
          // scores
          skillScores
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

        const event = receipt.events.find((e) => e.event === "TaskCompleted");
        if (event) {
          onCompleted && onCompleted(taskPrimaryID);
        }

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
    onCancel(taskPrimaryID, isSuccess);

    setIsSuccess(false);
    setCID(null);
    setTxHash(null);
    setBlockHeight(null);
    setTxCost(null);
  };

  const Views = [
    <ReviewForm
      form={form}
      memberList={memberList}
      skills={(taskQuery?.data?.task?.skills ?? []).map((s) => s.name)}
      onReject={handleReject}
      onApprove={handleApprove}
    />,
    <UploadingAndSendingTx
      current={waitingStep}
      cid={cid}
      txHash={txHash}
      descriptionForFutureTx={descriptionsForTx[0] ?? ""}
      descriptionForOngoingTx={descriptionsForTx[1] ?? ""}
    />,
    <TxResult
      isSuccess={isSuccess}
      txHash={txHash}
      blockHeight={blockHeight}
      txCost={txCost}
      successMessage={resultMessages[1] ?? ""}
      errorMessage={resultMessages[0] ?? ""}
    />,
  ];

  const Titles = ["レビュー中タスク", "", ""];

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

export default TaskReviewerModal;
