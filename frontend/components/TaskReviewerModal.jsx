// (承認ボタン、修正依頼ボタン、コメント用フォームがある)
// レビュー中の一番上とかのタスクをクリックすると開く。
// (これは別タブで開くか)
import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Tag,
  Button,
  Divider,
  Slider,
  Typography,
  Layout,
  Spin,
} from "antd";
import { useDAOContext } from "../contexts/dao_context";
import { useAccount, useSigner } from "wagmi";
import { useTask } from "../hooks/task";
import { uploadToIPFS } from "../clients/ipfs";
import { AccountsMap } from "../consts/accounts";
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
import { useIPFSData } from "../hooks/ipfs_file";
import { SideTaskOverview } from "./SideTaskOverview";
import { TaskDescription } from "./TaskDescription";

const { Text } = Typography;
const { Sider, Content } = Layout;

const InputReview = (props) => {
  const { form, skills, onApprove, onReject } = props;
  const comment = Form.useWatch("review_comment", form);

  return (
    <>
      <Text style={{ fontWeight: "bold" }}>タスクの評価</Text>
      <div
        className="grid grid-cols-2 gap-4"
        style={{ margin: "24px 0px 0px" }}
      >
        {skills.map((skill, index) => {
          return (
            <Form.Item
              label={skill}
              name={`skill_points[${index}]`}
              style={{ display: "inline-block" }}
            >
              <Slider min={1} max={5} defaultValue={3} />
            </Form.Item>
          );
        })}
      </div>
      <div style={{ padding: "12px 0px 0px" }}>
        <Form.Item
          label="コメント"
          name="review_comment"
          rules={[{ required: false, message: "Please enter your comment" }]}
          style={{ marginTop: "8px" }}
        >
          <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
        </Form.Item>
        <div class="flex justify-end items-center">
          <Button
            type="primary"
            danger
            htmlType="submit"
            className="mr-3"
            onClick={() => onReject(comment)}
          >
            修正を依頼する
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              const skillPoints = skills.map((_s, index) => {
                return form.getFieldValue(`skill_points[${index}]`);
              });

              onApprove(comment, skillPoints);
            }}
          >
            タスクを承認する
          </Button>
        </div>
      </div>
    </>
  );
};

const TaskView = (props) => {
  const {
    task,
    taskMetadata,
    form,
    onReject,
    onApprove,
    loading,
    showsReviewInput,
  } = props;
  const skills = (task?.skills ?? []).map((s) => s.name);

  if (loading) {
    return (
      <div
        className="flex flex-col items-center content-center justify-center"
        style={{ minHeight: "400px" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout>
      <Content>
        <div style={{ paddingRight: "24px" }}>
          <TaskDescription text={taskMetadata?.description} />
          <Divider />
          <Form form={form} layout="vertical">
            {showsReviewInput && (
              <InputReview
                form={form}
                skills={skills}
                onApprove={onApprove}
                onReject={onReject}
              />
            )}
          </Form>
        </div>
      </Content>
      <Sider theme="light">
        <SideTaskOverview task={task} />
      </Sider>
    </Layout>
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

  const { address } = useAccount();
  const taskQuery = useTask(taskPrimaryID);
  const { data: taskMetadata, loading: isMetadataLoading } = useIPFSData(
    taskQuery?.data?.task?.metadataURI ?? ""
  );

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
    <TaskView
      task={taskQuery?.data?.task}
      taskMetadata={taskMetadata}
      form={form}
      onReject={handleReject}
      onApprove={handleApprove}
      loading={taskQuery.loading || isMetadataLoading}
      showsReviewInput={(taskQuery?.data?.task?.reviewers ?? []).some(
        (t) => t === address
      )}
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

export default TaskReviewerModal;
